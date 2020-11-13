import {Terminal} from "xterm";
import "xterm/css/xterm.css";
// import {AttachAddon} from "xterm-addon-attach";
import {FitAddon} from "xterm-addon-fit";
import {io} from "socket.io-client";


export const mountTerminal = (divId, repo, cntId) => {

    const term = new Terminal({
        useStyle: true,
        convertEol: true,
        screenKeys: true,
        cursorBlink: true,
        visualBell: true,
        rendererType: "canvas",
        // theme: {
        //     background: "#101010",
        //     foreground: "#00983a",
        // }
    });

    // const host = window.location.origin;
    const socket = io("http://localhost:3000");
    // const socket = require('socket.io-client')('http://localhost:3000');

    // term.loadAddon(new AttachAddon());
    // term.loadAddon(fit);

    // const attachAddon = new AttachAddon(socket);
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(document.getElementById(divId));
    fitAddon.fit();
    term.focus();
    // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');

    socket.emit('exec', cntId, /*term.width, term.height*/);

    term.onData((data) => {
    // term.on('data', (data) => {
        socket.emit('cmd', data);
    });

    socket.on('show', (data) => {
        term.writeln(data);
    });

    socket.on('end', (status) => {
        term.clear();
        socket.disconnect();
    });
}
