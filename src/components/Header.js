// this component is called Header to prevent collisions with react-bootstrap's Navbar component

import React from "react";
import {Navbar, Container} from "react-bootstrap";

const Header = props => {
    return(
        <Navbar
        expand={"sm"}
        className={"top"}>
            <Container>
                <Navbar.Brand
                href={"/"}>
                    <img
                        src={"weee.svg"}
                        height={69}
                        alt={"WEEE Open"}
                    />
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default Header;