const apiPrefix = "/api";

async function getRepos() {
    return new Promise(((resolve, reject) => {
        fetch(`${apiPrefix}/repos`)
            .then(res => {
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
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({user_email: email})
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
            body: JSON.stringify({user_email: email, cnt_id: cnt_id})
        }).then(res => {
            if (res.ok)
                resolve(res.json());
            else
                reject(res.json().error);
        }).catch(err => reject(err));
    }));
}

const API = {getRepos, getContainer, deleteContainer};
export default API;