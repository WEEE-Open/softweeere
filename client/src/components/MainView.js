import React, {useEffect, useRef, useState} from "react";
import {CardColumns, Container} from "react-bootstrap";
import DockerCard from "./mainview/DockerCard";
import DockerTerminal from "./mainview/DockerTerminal";
import ScrollUpButton from "react-scroll-up-button";
import API from "../API";

const MainView = props => {
    const {embeds, buttonHandler, color} = props;
    const bottomOfThePageRef = useRef(null);

    const [repos, setRepos] = useState([]);

    // componentDidMount
    useEffect(() => {
        API.getRepos()
            .then(json => setRepos(json))
            .catch(err => console.log(err));
    }, []);

    const scrollToBottom = () => {
        bottomOfThePageRef.current.scrollIntoView({behavior: "smooth"});
    }

    return (
        <Container id={"MainView"}>
            {embeds ?
                <div id={"Embeds"}>
                    {/*see https://code.luasoftware.com/tutorials/bootstrap/bootstrap-hide-element-based-on-viewport-size/*/}
                    <h1 className={"d-none d-md-block"}>Try our software here!</h1>
                    <h2 className={"d-none d-sm-block d-md-none"}>Try our software here!</h2>
                    <h3 className={"d-block d-sm-none"}>Try our software here!</h3>
                    {/*<CardColumns className={"pt-3"}>*/}
                    {/*    {embeds.map((embed, idx) =>*/}
                    {/*        <DockerCard*/}
                    {/*        key={idx}*/}
                    {/*        num={idx}*/}
                    {/*        embed={embed}*/}
                    {/*        buttonHandler={buttonHandler}*/}
                    {/*        scrollToBottom={scrollToBottom}*/}
                    {/*        />)}*/}
                    {/*</CardColumns>*/}
                    {/*{embeds*/}
                    {/*.map((embed, idx) =>*/}
                    {/*    <KatacodaEmbed*/}
                    {/*        key={idx}*/}
                    {/*        num={idx}*/}
                    {/*        embed={embed}*/}
                    {/*        color={color}*/}
                    {/*    />)}*/}
                    {/*TODO: use map like above*/}
                    <DockerTerminal
                        repo={repos[2]}
                    />
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