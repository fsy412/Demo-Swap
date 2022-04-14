import React, { useContext } from "react";
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import { Navbar, Container, Nav, NavDropdown, NavItem } from 'react-bootstrap'
import { Link } from "react-router-dom";
import "./PageHead.css"

const PageHead = () => {
    const { account, connectWallet } = useContext(Web3Context);
    const short = (val: string) => {
        return val.substring(0, 6) + '...' + val.substring(val.length - 4, val.length)
    }
    return (<Navbar bg="light" expand="lg">
        <img className="logo" src="https://miro.medium.com/fit/c/176/176/1*LRJ2wZUqNQHTOm1KkRlmUA.jpeg" alt="logo" />
        <Navbar.Brand as={Link} className="headerText" to="/">Bridge</Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
                <Nav.Link as={Link} className="faucet" to="/faucet" >Faucet</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link as={Link} className="wallet" to="" onClick={connectWallet}> {account ? short(account?.toString()) : "Connect To Wallet"}</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>)
}

export default PageHead;