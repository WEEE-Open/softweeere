import React, {useRef} from "react";
import {CardColumns, Container} from "react-bootstrap";
import KatacodaCard from "./mainview/KatacodaCard";
import KatacodaEmbed from "./mainview/KatacodaEmbed";
import ScrollUpButton from "react-scroll-up-button";

const MainView = props => {
    const {embeds, buttonHandler, color} = props;
    const bottomOfThePageRef = useRef(null);
    const scrollToBottom = () => {
        bottomOfThePageRef.current.scrollIntoView({behavior: "smooth"});
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
                            scrollToBottom={scrollToBottom}
                            />)}
                    </CardColumns>
                    {embeds
                    .map((embed, idx) =>
                        <KatacodaEmbed
                            key={idx}
                            num={idx}
                            embed={embed}
                            color={color}
                        />)}
                </div> :
                <div id={"NoEmbeds"}>
                    <h1>No embeds added to the website. Maybe there's a configuration error?</h1>
                </div>
            }
            <ScrollUpButton
                ContainerClassName="scrollUp"
                TransitionClassName="transitionUp"
            >
                <span role="img" aria-label={"go to top"}>🔝</span>
            </ScrollUpButton>
            <div ref={bottomOfThePageRef} />
        </Container>
    );
}

export default MainView;