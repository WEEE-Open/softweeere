import React from "react";
import {CardColumns, Container} from "react-bootstrap";
import KatacodaCard from "./mainview/KatacodaCard";

const MainView = props => {
    const {embeds, color} = props;

    return (
        <Container id={"MainView"}>
            {embeds ?
                <div id={"Embeds"}>
                    <h1>Try our software here!</h1>
                    <CardColumns className={"pt-3"}>
                        {embeds.map((embed, idx) => <KatacodaCard key={idx} num={idx} embed={embed} color={color} />)}
                    </CardColumns>
                </div> :
                <div id={"NoEmbeds"}>
                    <h1>No embeds added to the website. Maybe there's a configuration error?</h1>
                </div>
            }
        </Container>
    );
}

export default MainView;