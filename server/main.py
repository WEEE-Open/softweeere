# run with uvicorn main:app --reload
# deploy with ?

from fastapi import FastAPI, Body, Request, status, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from fastapi_users import FastAPIUsers, models
from fastapi_users.authentication import CookieAuthentication
from fastapi_users.db import MongoDBUserDatabase
import motor.motor_asyncio
import docker
from docker.errors import DockerException, APIError, NotFound
from requests.exceptions import ChunkedEncodingError

from enum import Enum
from datetime import datetime
from typing import Dict, List
from sys import stderr

from secret import secret_key

cookie_lifetime = 3600  # seconds


# an enum class which contains the Docker container names of our repos
class Repository(str, Enum):
    peracotta = "peracotta"
    sardina = "sardina"
    weeehire_ng = "weeehire-ng_nginx"
    # TODO: support custom docker registry


# a class to represent a running container
class Container(BaseModel):
    cnt_id: str
    user_email: EmailStr


class User(models.BaseUser):
    container_ids: Dict[str, str] = {}
    expire_unix: int = int(datetime.utcnow().timestamp()) + cookie_lifetime


class UserCreate(models.BaseUserCreate):
    pass


class UserUpdate(User, models.BaseUserUpdate):
    pass


class UserDB(User, models.BaseUserDB):
    pass


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


# while request is not called directly, it is needed for this function to work
def on_after_register(user: UserDB, request: Request):
    print(f"User {user.email} has registered.")


async def get_running_container(repo: str):
    try:
        cnt = client.containers.run(repo, auto_remove=True, detach=True)
        return {
            "repo": repo,
            "id": cnt.id,
        }
    except APIError:
        raise


async def remove_container(cnt_id: str):
    try:
        cnt = client.containers.get(cnt_id)
        cnt.stop()
        # cnt.remove()  # not needed if auto_remove=True
    except Exception:
        pass


async def remove_user_containers(container_ids: Dict[str, str]):
    for repo in container_ids:
        await remove_container(container_ids[repo])


async def get_old_or_new_user(user_email: EmailStr):
    user = await user_db.get_by_email(user_email)
    if user:
        now = int(datetime.utcnow().timestamp())
        if user.expire_unix < now:
            await remove_user_containers(user.container_ids)
            user.container_ids = {}
            user.expire_unix = int(datetime.utcnow().timestamp()) + cookie_lifetime
            await user_db.update(user)
    return user


cookie_name = "softweeere"
cookie_authentication = CookieAuthentication(
    secret=secret_key,
    lifetime_seconds=cookie_lifetime,
    cookie_name=cookie_name,
)

db_url = "mongodb://localhost:27017"
db = motor.motor_asyncio.AsyncIOMotorClient(db_url, uuidRepresentation="standard")['softweeere']
collection = db["users"]
user_db = MongoDBUserDatabase(UserDB, collection)
fastapi_users = FastAPIUsers(
    user_db,
    [cookie_authentication],
    User,
    UserCreate,
    UserUpdate,
    UserDB,
)

api_prefix = "/api"
app = FastAPI()
app.include_router(fastapi_users.get_register_router(on_after_register),
                   prefix=f"{api_prefix}/auth", tags=["auth"])
app.include_router(fastapi_users.get_auth_router(cookie_authentication),
                   prefix=f"{api_prefix}/auth", tags=["auth"])
app.include_router(fastapi_users.get_users_router(),
                   prefix=f"{api_prefix}/users", tags=["users"])

ws_manager = ConnectionManager()

try:
    client = docker.from_env()
except DockerException:
    print("Docker is not running / Connection refused", file=stderr)


# REST API server

@app.get(api_prefix + "/")
async def root():
    return {"message": "Server is running correctly"}


@app.post(api_prefix + "/repos")
async def get_repos(user_email: EmailStr = Body(..., embed=True)):
    user = await get_old_or_new_user(user_email)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED,
                            content={"error": f"user {user_email} not found"})
    try:
        return JSONResponse(status_code=status.HTTP_200_OK,
                            content={repo.name: repo.value for repo in Repository})
    except Exception:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content={"error": "Cannot get available repositories"})


@app.post(api_prefix + "/container/{repo}")
async def get_container(repo: Repository, user_email: EmailStr = Body(..., embed=True)):
    user = await get_old_or_new_user(user_email)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED,
                            content={"error": f"user {user_email} not found"})
    try:
        # check if user already has container of given repo
        if repo in user.container_ids:
            return JSONResponse(status_code=status.HTTP_200_OK,
                                content={"repo": repo, "user": user_email, "cnt_id": user.container_ids[repo]})
        cnt = await get_running_container(repo)
        # add container id to user's container_ids dict
        user.container_ids[repo] = cnt['id']
        await user_db.update(user)
        return JSONResponse(status_code=status.HTTP_201_CREATED,
                            content={"repo": repo, "user": user_email, "cnt_id": cnt['id']})
    except APIError:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content={"repo": repo, "error": "Cannot instantiate Docker container"})


# see https://fastapi.tiangolo.com/advanced/websockets/
# e.g. ws[s]://addr/sardina?cnt_id=abc?user_email=test@example.com
@app.websocket(api_prefix + "/ws/{repo}")
async def websocket_endpoint(websocket: WebSocket,
                             repo: Repository,  # path param
                             cnt_id: str,  # query param
                             user_email: EmailStr):  # query param
    # TODO: WARNING:  Unsupported upgrade request.
    # also, this is not printed out
    print(repo, cnt_id, user_email)
    user = await get_old_or_new_user(user_email)
    if not user:
        return JSONResponse(status_code=status.WS_1008_POLICY_VIOLATION,
                            content={"error": f"user {user_email} not found"})
    if repo not in user.container_ids or cnt_id != user.container_ids[repo]:
        return JSONResponse(status_code=status.WS_1008_POLICY_VIOLATION,
                            content={"error": f"container {cnt_id} does not belong to user {user_email}"})
    try:
        cnt = client.containers.get(cnt_id)
        # TODO: how to define custom websocket? is this correct?
        websocket = cnt.attach_socket(params={"stdout": True,
                                              "stderr": True,
                                              "stream": True,
                                              "demux": False},
                                      ws=True)
    except NotFound:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"Container {cnt_id} does not exist"})
    except APIError:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content={"error": f"Cannot instantiate stream to container {cnt_id} for user {user_email}"})
    try:
        await ws_manager.connect(websocket)
    except Exception:
        return JSONResponse(status_code=status.WS_1005_ABNORMAL_CLOSURE,
                            content={"error": "Cannot connect to websocket"})
    try:
        while True:
            data = await websocket.receive_text()
            await ws_manager.send_personal_message(f"You wrote: {data}", websocket)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
        return JSONResponse(status_code=status.WS_1000_NORMAL_CLOSURE,
                            content={"message": f"Closed connection for user {user_email}"})


# @app.post(api_prefix + "/stream/{repo}")
# async def get_container_stream(repo: Repository,
#                                user_email: EmailStr = Body(..., embed=True),
#                                cnt_id: str = Body(..., embed=True)):
#     user = await get_old_or_new_user(user_email)
#     if not user:
#         return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED,
#                             content={"error": f"user {user_email} not found"})
#     if repo not in user.container_ids or cnt_id != user.container_ids[repo]:
#         return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED,
#                             content={"error": f"container {cnt_id} does not belong to user {user_email}"})
#     try:
#         cnt = client.containers.get(cnt_id)
#         # TODO: find out needed method for Xterm.js between attach or attach_socket
#         # return StreamingResponse(status_code=status.HTTP_200_OK,
#         #                          content=cnt.attach(stdout=True, stderr=True, stream=True, demux=False))
#         return StreamingResponse(status_code=status.HTTP_200_OK,
#                                  content=cnt.attach_socket(params={"stdout": True,
#                                                                    "stderr": True,
#                                                                    "stream": True,
#                                                                    "demux": False},
#                                                            ws=True))
#     except NotFound:
#         return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
#                             content={"error": f"Container {cnt_id} does not exist"})
#     except APIError:
#         return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                             content={"error": f"Cannot instantiate stream to container {cnt_id} for user {user_email}"})


@app.delete(api_prefix + "/container/{repo}")
async def delete_container(repo: Repository,
                           user_email: EmailStr = Body(..., embed=True),
                           cnt_id: str = Body(..., embed=True)):
    user = await get_old_or_new_user(user_email)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED,
                            content={"error": f"user {user_email} not found"})
    if repo not in user.container_ids or cnt_id != user.container_ids[repo]:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED,
                            content={"error": f"container {cnt_id} does not belong to user {user_email}"})
    try:
        try:
            _ = client.containers.get(cnt_id)
        # TODO: understand why this exception is raised
        except ChunkedEncodingError:
            return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                                content={"error": f"Container {cnt_id} does not exist"})
        await remove_container(cnt_id)
        # remove repo from user's container_ids dict
        del user.container_ids[repo]
        await user_db.update(user)
        return JSONResponse(status_code=status.HTTP_200_OK,
                            content={"user": user_email, "cnt_id": cnt_id})
    except NotFound:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"error": f"Container {cnt_id} does not exist"})
    except APIError:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content={"error": f"Cannot stop container {cnt_id} for user {user_email}"})

