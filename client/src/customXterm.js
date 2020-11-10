import {Terminal} from "xterm";
import {AttachAddon} from "xterm-addon-attach";

export const mountTerminalAtId = id => {
    // see https://xtermjs.org/docs/api/addons/attach/
    const term = new Terminal();
    // const socket = new WebSocket();
    // const attachAddon = new AttachAddon(socket);
    // term.loadAddon(attachAddon);
    term.open(document.getElementById(id));
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
}
