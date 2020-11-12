"use strict";

const app = require('express')();
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const secretKey = require("./secretKey").secretKey;

const options = {
    perMessageDeflate: false,
    // cors: {
    //     origin: "http://localhost:8000",
    //     methods: ["GET", "POST", "DELETE"],
    // }
}
const server = require('http').createServer(app);
const io = require('socket.io')(server, options);

const sessionMiddleware = session({
    name: "softweeere",
    secret: secretKey,
    cookie: {
        secure: false,  // TODO: enable when using HTTPS
        maxAge: null,  // delete cookie when session ends
    },
    resave: false,
    saveUninitialized: true,  // TODO: set to false to comply with laws that require user accepting cookies
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

io.on('connect', (socket) => {
    const session = socket.request.session;
    session.connections++;
    session.save();
});

const port = process.env.PORT || 3000;
server.listen(port);