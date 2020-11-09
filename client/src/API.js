import {v4 as uuid} from "uuid";

const apiPrefix = "/api";
// the password is global for every user, since authentication is purely based
// on randomly generated fake email addresses
const password = "softweeere";

const getRandomString = () => uuid();


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
            else
                reject(res.json().error);
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
            else
                reject(res.json().error);
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

async function getRepos(email) {
    return new Promise(((resolve, reject) => {
        fetch(`${apiPrefix}/repos`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email})
        }).then(res => {
            if (res.ok)
                resolve(res.json());
            else
                reject(res.json().error);
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
            else
                reject(res.json().error);
        }).catch(err => reject(err));
    }));
}

async function deleteContainer(email, repo, cnt_id) {
    return new Promise(((resolve, reject) => {
        fetch(`${apiPrefix}/container/${repo}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email, cnt_id: cnt_id})
        }).then(res => {
            if (res.ok)
                resolve(res.json());
            else
                reject(res.json().error);
        }).catch(err => reject(err));
    }));
}

const API = {register, login, isLoggedIn, getRepos, getContainer, deleteContainer};
export default API;