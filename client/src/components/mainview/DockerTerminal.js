import React, {useEffect} from "react";
import {mountTerminal} from "../../customXterm";

const DockerTerminal = props => {

    const {user, repo} = props;

    const id = `terminal-${repo}`;
    let cnt_id = "";
    let email = "";
    if (user.containerIds !== undefined)
        cnt_id = user.containerIds[repo];
        email = user.email;

    useEffect(() => {
        if (cnt_id && email)
            mountTerminal(id, repo, cnt_id, email);
    }, [id, repo, cnt_id, email]);

    return (
        <div>
            <div id={id} />
        </div>
    );
}

export default DockerTerminal;