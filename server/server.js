"use strict";

const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const secretKey = require("./secretKey").secretKey;
const path = require("path");
const docker = new require('dockerode')();
const stream = require('stream');

const options = {
    perMessageDeflate: false,
    // cors: {
    //     origin: "http://localhost:8000",
    //     methods: ["GET", "POST", "DELETE"],
    // }
}
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, options);

app.use(morgan("tiny"));  // add logging
app.use("/", express.static(path.join("..", "client", "build")));  // host frontend build static files

const sessionMiddleware = session({
    name: "softweeere",
    secret: secretKey,
    cookie: {
        secure: false,  // TODO: enable when using HTTPS
        maxAge: null,  // delete cookie when session ends
    },
    resave: false,
    saveUninitialized: true,  // TODO: set to false to comply with laws that require user accepting cookies
    // see session data from mongo -> use test; db.sessions.find()
    store: new MongoStore({
        url: "mongodb://localhost:27017",
        ttl: 18 * 60 * 60,  // 18 hours
        autoRemove: "native",
    }),
});

// register middleware in Express
app.use(sessionMiddleware);
// register middleware in Socket.IO
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
    // sessionMiddleware(socket.request, socket.request.res, next); will not work with websocket-only
    // connections, as 'socket.request.res' will be undefined in that case
});


const dockerRegistry = "docker.caste.dev";
const repos = {
    peracotta: `${dockerRegistry}/peracotta`,
    sardina: `${dockerRegistry}/sardina`,
    weeehire_ng: `${dockerRegistry}/weeehire-ng_nginx`,
}

const messages = {
    containerFound: {"message": "Existing container found for required repo"},
    containerCreated: {"message": "New container created for required repo"},
}

const errors = {
    unauthorized: {"error": "No authentication cookie found"},
    repoNotFound: {"error": "Repository not found"},
}

// REST API server

const apiPrefix = "/api";

app.get(`${apiPrefix}/repos`, (req, res) => {
    const userId = req.sessionID;
    if (userId !== undefined)
        res.status(200).json(Object.keys(repos)).end();
    else
        res.status(401).json(errors.unauthorized).end();
});

app.get(`${apiPrefix}/container/:repo`, ((req, res) => {
    const repo = req.params.repo;
    if (!(repo in repos))
        res.status(404).json(errors.repoNotFound).end();
    let session = req.session;
    if (session.repos === undefined)
        session.repos = {}
    if (repo in session.repos)
        res.status(200).json({...messages.containerFound, id: session.repos[repo]}).end();
    else {
        docker.createContainer({
            Image: repos[repo],
            AttachStdin: false,
            AttachStdout: true,
            AttachStderr: true,
            Tty: false,
            HostConfig: {
                PortBindings: {}
            },
        }).then(cnt => {
            session.repos[repo] = cnt.id
            session.save();
            res.status(201).json({...messages.containerCreated, id: cnt.id}).end();
        }).catch(err => res.status(err.statusCode).json(err.json).end());
    }
}));


// Socket.IO server

// io.on('connect', (socket) => {
//     const session = socket.request.session;
//     session.connections++;
//     session.save();
// });

io.on('connection', socket => {
    const session = socket.request.session;
    socket.on('exec', (repo, id, w, h) => {
        if (!(repo in session.repos)) return;
        const cnt = docker.getContainer(id);
        cnt.exec({
           AttachStdout: true,
           AttachStderr: true,
           AttachStdin: true,
           Tty: true,
           Cmd: ["/bin/bash"],  // assuming every container has bash installed
        }, (err, exec) => {
           // cnt.wait();
           if (err) return;
           exec.start({
               Tty: true,
               stream: true,
               stdout: true,
               stderr: true,
               stdin: true,
               hijack: true,
           }, (err, stream) => {
               if (h !== 0 && w !== 0)
                   exec.resize({h, w});
               stream.on('data', chunk => socket.emit('show', chunk.toString()));
               stream.on('cmd', data => stream.write(data));
           });
       });
   });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`SoftWEEEre server running at http://localhost:${port}`));