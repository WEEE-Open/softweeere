import React, {useEffect, useState} from "react";
import {mountTerminal} from "../../customXterm";
import API from "../../API";

const DockerTerminal = props => {

    const {repo} = props;
    const divId = `terminal-${repo}`;

    const [cntId, setCntId] = useState(null);

    // componentDidMount
    useEffect(() => {
        API.getContainer(repo)
            .then(json => setCntId(json.id))
            .catch(err => console.log(err));
    }, [repo]);

    useEffect(() => {
        mountTerminal(divId, repo, cntId);
    }, [divId, repo, cntId]);

    return (
        <div id={divId} />
    );
}

export default DockerTerminal;