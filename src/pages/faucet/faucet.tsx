import React, { useState, useContext } from "react";
import { Container, Dropdown, InputGroup, FormControl } from 'react-bootstrap'
import "./faucet.scss"
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import { CONFIG } from '../../config/chain'

export const Faucet = () => {
    const { account, chainName, faucet } = useContext(Web3Context);

    const handleSelect = async (eventKey: any, e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault()
        let target = e.target as HTMLInputElement;
        if (chainName) {
            let list = CONFIG.FaucetTokenList.filter(k => (k.Name === chainName))[0].List
            let tokenAddress = list.filter(k => (k.name == target.textContent))[0].address;
            console.log(`token:${target.textContent} address:${tokenAddress}, chain:${chainName}`)
            await faucet(tokenAddress)
        }
    }

    return (
        <Container className="container-fluid faucetContainer">
            <div className='inputGroup'>
                <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle>
                        Give me token
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {
                            <Dropdown.Item href="">DANT</Dropdown.Item>
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Container>
    )
}

export default Faucet



