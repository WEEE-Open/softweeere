import React from "react";

const KatacodaEmbed = props => {
    const {num, embed, color} = props;

    return (
        <div
            id={`embed-${num}`}
            className={"pt-3"}
            style={{
                // use this instead of ReactJS conditional rendering
                // because otherwise Katacoda doesn't contact the backend
                visibility: embed.isActive ? "visible": "hidden",
                display: embed.isActive ? "initial" : "none",
            }}
        >
            <hr/>
            <h3>{embed.title}</h3>
            <div id={`katacoda-scenario-${num}`}
                data-katacoda-id={embed.katacoda}
                data-katacoda-color={color}
                style={{
                    height: "600px",
                    paddingTop: "20px",
                }}
            />
        </div>
    );
}

export default KatacodaEmbed;