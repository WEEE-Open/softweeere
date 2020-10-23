import React, {useState} from "react";
import {Button, Card} from "react-bootstrap";
import {buttonTexts} from "../../utils";

const KatacodaCard = props => {
    const {num, embed, buttonHandler, scrollToBottom} = props;
    const [buttonText, setButtonText] = useState(buttonTexts.toPress);

    const toggleButton = () => {
        if(buttonText === buttonTexts.toPress) scrollToBottom();
        setButtonText(buttonText === buttonTexts.toPress ? buttonTexts.pressed : buttonTexts.toPress);
        buttonHandler(embed);
    }

    return (
        <Card id={`card-${num}`}
            border={"success"}
        >
            <Card.Img
                src={`${embed.type}.svg`}
                alt={embed.title}
                variant={"top"}
            />
            <Card.Body>
                <Card.Title>{embed.title}</Card.Title>
                <Card.Text>{embed.description}</Card.Text>
                <Button
                    variant={"success"}
                    onClick={toggleButton}
                >
                    {buttonText}
                </Button>
            </Card.Body>
            <Card.Footer>
                <a href={`https://github.com/${embed.github}`} target="_blank" rel="nofollow">GitHub page</a>
            </Card.Footer>
        </Card>
    );
}

export default KatacodaCard;