import React, { useContext } from "react";
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from "react-router-dom";
import "./PageHead.css"

const PageHead = () => {
    const { account, chainName, connectWallet } = useContext(Web3Context);
    const short = (val: string) => {
        return chainName + " (" + val.substring(0, 6) + '...' + val.substring(val.length - 4, val.length) + ")"
    }
    return (
        <div className=" navbar" >
            <Navbar bg="light" expand="md" >
                <img className="logo" src="logo.png" alt="logo" />
                <Navbar.Brand as={Link} className="headerText" to="/">Bridge</Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto"></Nav>
                    <Nav>
                        {account != "" ? <Nav.Link as={Link} className="faucet" to="/Trade" >Trade</Nav.Link> : null}
                    </Nav>
                    <Nav>
                        <Nav.Link as={Link} className="faucet" to="/" >Bridge</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link as={Link} className="faucet" to="/faucet" >Faucet</Nav.Link>
                    </Nav>
                    <Nav className="me-auto"></Nav>
                    <Nav>
                        <Nav.Link className="wallet" onClick={connectWallet}> {account ? short(account?.toString()) : "Connect To Wallet"}</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

        </div>
    )
}

export default PageHead;