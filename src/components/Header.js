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
                        src={"weee.png"}
                        height={69}
                        className={"img-fluid"}
                        alt={"WEEE Open"}
                    />
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default Header;