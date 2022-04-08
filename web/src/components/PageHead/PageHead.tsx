import React from 'react';
import { useContext } from "react";
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import "./PageHead.css"

const PageHead = () => {
    const { account, connectWallet } = useContext(Web3Context);
    return (<Navbar bg="light" expand="lg">
        <img className="logo" src="https://miro.medium.com/fit/c/176/176/1*LRJ2wZUqNQHTOm1KkRlmUA.jpeg" alt="logo" />
        <Navbar.Brand className="headerText" href="#home">Bridge</Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">  </Nav>
            <Nav>
                <Nav.Link className="wallet" href="#" onClick={connectWallet}> {account ? account?.toString() : "Connect To Wallet"}</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link className="disconnect" href="#" >Disconnect</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>)
}

export default PageHead;