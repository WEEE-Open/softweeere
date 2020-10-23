import React from "react";

const KatacodaEmbed = props => {
    const {num, embed, color} = props;

    return (
        <div id={`embed-${num}`} className={"pt-3"}>
            <h3>{embed.title}</h3>
            <hr/>
            <p>Find more info on the <a href={`https://github.com/${embed.github}`}>GitHub page</a></p>
            <div id={`katacoda-scenario-${num}`}
                data-katacoda-id={embed.katacoda}
                data-katacoda-color={color}
                style={{height: "600px", paddingTop: "20px"}}
            />
            <hr/>
        </div>
    );
}

export default KatacodaEmbed;