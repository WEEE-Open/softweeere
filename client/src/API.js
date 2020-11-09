import uuid from "uuid";

const apiPrefix = "/api";
// the password is global for every user, since authentication is purely based
// on randomly generated fake email addresses
const password = "softweeere";

const getRandomString = () => uuid.v4();

// TODO: update response handling with new HTTP status codes in all APIs
async function register() {
    return new Promise(((resolve, reject) => {
        const email = `${getRandomString()}@example.com`;
        fetch(`${apiPrefix}/auth/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email, password: password})
        }).then(res => {
                if (res.ok)
                    resolve(res.json());
                else if (res.status === 400)
                    reject(`User ${email} already registered`)
                else if (res.status === 422)
                    reject("Validation error")
        }).catch(err => reject(err));
    }));
}

async function login(email) {
    return new Promise(((resolve, reject) => {
        fetch(`${apiPrefix}/auth/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email, password: password})
        }).then(res => {
            if (res.ok)
                resolve(null);
            else if (res.status === 400)
                reject("Wrong email or password")
            else if (res.status === 422)
                reject("Validation error")
        }).catch(err => reject(err));
    }));
}

async function isLoggedIn() {
    return new Promise(((resolve, reject) => {
        fetch(`${apiPrefix}/users/me`)
            .then(res => {
                if (res.ok)
                    resolve(true);
                else
                    resolve(false);
            }).catch(err => reject(err));
    }));
}

async function getContainer(email, repo) {
    return new Promise(((resolve, reject) => {
        fetch(`${apiPrefix}/container/${repo}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email})
        }).then(res => {
            if (res.ok || res.status === 201)
                resolve(res.json());
            else if (res.status === 401)
                reject("Unauthorized");
            else if (res.status === 422)
                reject("Validation error");
            else if (res.status === 500)
                reject("Internal server error");
        }).catch(err => reject(err));
    }));
}

const API = {register, login, isLoggedIn, getContainer};
export default API;