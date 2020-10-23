import React from "react";
import {CardColumns, Container} from "react-bootstrap";
import KatacodaCard from "./mainview/KatacodaCard";
import KatacodaEmbed from "./mainview/KatacodaEmbed";

const MainView = props => {
    const {embeds, buttonHandler, color} = props;

    const isAnyEmbedActive = () => {
        for(let embed of embeds) {
            if(embed.isActive)
                return true;
        }
        return false;
    }

    return (
        <Container id={"MainView"}>
            {embeds ?
                <div id={"Embeds"}>
                    <h1>Try our software here!</h1>
                    <CardColumns className={"pt-3"}>
                        {embeds.map((embed, idx) =>
                            <KatacodaCard
                            key={idx}
                            num={idx}
                            embed={embed}
                            buttonHandler={buttonHandler}
                            />)}
                    </CardColumns>
                    {isAnyEmbedActive() &&
                    <div>
                        <hr/>
                        {embeds.filter(e => e.isActive)
                        .map((embed, idx) =>
                            <KatacodaEmbed
                                key={idx}
                                num={idx}
                                embed={embed}
                                color={color}
                            />)}
                    </div>
                    }
                </div> :
                <div id={"NoEmbeds"}>
                    <h1>No embeds added to the website. Maybe there's a configuration error?</h1>
                </div>
            }
        </Container>
    );
}

export default MainView;