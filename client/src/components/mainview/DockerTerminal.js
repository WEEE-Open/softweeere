import React, {useEffect} from "react";
import {mountTerminalAtId} from "../../customXterm";

const DockerTerminal = props => {

    const id = "terminal";

    useEffect(() => {
        mountTerminalAtId(id);
    }, []);

    return (
        <div>
            <div id={id} />
        </div>
    );
}

export default DockerTerminal;