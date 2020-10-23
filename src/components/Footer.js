import React from "react";
import {Navbar} from "react-bootstrap";

const Footer = props => {
    return (
        <div>
            <Navbar
                className={"bottom mt-5 flex-column"}
            >
                <Navbar.Text className={"flex-row"}>
                    Contribute or clone this website <a href="https://github.com/e-caste/softweeere" target="_blank" rel="nofollow">here</a>!
                </Navbar.Text>
                <Navbar.Text className={"flex-row"}>
                    Follow us on Facebook:
                    <a href="https://www.facebook.com/weeeopen/" target="_blank" rel="nofollow"> Team WEEE Open</a>
                    , Instagram:
                    <a href="https://www.instagram.com/weeeopen/" target="_blank" rel="nofollow"> @weeeopen</a>
                    , LinkedIn:
                    <a href="https://www.linkedin.com/company/weee-open/" target="_blank" rel="nofollow"> WEEE Open </a>
                    and on PoliTOnet:
                    <a href="https://politecnico-di-torino.hivebrite.com/topics/9837/" target="_blank" rel="nofollow"> Team WEEE Open</a>
                </Navbar.Text>
            </Navbar>
        </div>
    );
}

export default Footer;