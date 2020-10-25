import React, {useState} from "react";
import {Button, Card, ListGroup} from "react-bootstrap";
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
                src={`card-imgs/${embed.image}`}
                alt={embed.title}
                height={90}
                variant={"top"}
                className={"mt-2"}
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
                <ListGroup className={"list-group-flush"}>
                    <ListGroup.Item>
                        <code>Language:</code> <img src={`${embed.type}.svg`} height={15} />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <a href={`https://github.com/${embed.github}`} target="_blank" rel="nofollow noopener noreferrer">GitHub page</a>
                    </ListGroup.Item>
                </ListGroup>
            </Card.Footer>
        </Card>
    );
}

export default KatacodaCard;