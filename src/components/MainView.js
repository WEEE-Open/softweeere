import React from "react";
import {Container} from "react-bootstrap";
import KatacodaEmbed from "./mainview/KatacodaEmbed";

const MainView = props => {
    const {embeds, color} = props;

    return (
        <Container id={"MainView"}>
            {embeds ?
                <div id={"Embeds"}>
                    <h1>Try our software here!</h1>
                    {embeds.map((embed, idx) => <KatacodaEmbed key={idx} num={idx} embed={embed} color={color} />)}
                </div> :
                <div id={"NoEmbeds"}>
                    <h1>No embeds added to the website. Maybe there's a configuration error?</h1>
                </div>
            }
        </Container>
    );
}

export default MainView;