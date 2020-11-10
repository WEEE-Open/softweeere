import {Terminal} from "xterm";
import "xterm/css/xterm.css";
import {AttachAddon} from "xterm-addon-attach";

export const mountTerminal = (id, repo, cnt_id, email) => {
    const term = new Terminal();
    term.setOption("theme", {
        background: "#101010",
        foreground: "#00983a",
    });
    // see https://xtermjs.org/docs/api/addons/attach/
    const socket = new WebSocket(`ws://localhost:8000/api/ws/${repo}?cnt_id=${cnt_id}?user_email=${email}`);
    const attachAddon = new AttachAddon(socket);
    term.loadAddon(attachAddon);
    term.open(document.getElementById(id));
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
}
