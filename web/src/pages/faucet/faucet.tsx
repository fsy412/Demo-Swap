import React, { useState, useContext } from "react";
import { Container, Dropdown, InputGroup, FormControl} from 'react-bootstrap'
import "./faucet.scss"
import Web3Context, { Web3Provider } from "../../context/Web3Context"
import { CONFIG } from '../../config/chain'
import { Toast } from "../../components/Toast/Toast"

export const Faucet = () => {
    const { account, chainName, faucet } = useContext(Web3Context);
    // const [showA, setShowA] = useState(true);

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
    const getTokenList = () => {
        return (chainName) ? CONFIG.FaucetTokenList.filter(k => (k.Name === chainName))[0].List : []
    }

    return (
        <Container className="faucetContainer">
            <div className='inputGroup'>
                <InputGroup className="mb-3 mt-3">
                    <FormControl
                        placeholder="Token address"
                        aria-label="Token address"
                        aria-describedby="basic-addon2"
                    />
                    <Dropdown onSelect={handleSelect}>
                        <Dropdown.Toggle>
                            Give me token
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {getTokenList().map((k) => {
                                return (
                                    <Dropdown.Item key={k.name} href="">{k.name}</Dropdown.Item>
                                )
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </InputGroup>
            </div>
        </Container>
    )
}

export default Faucet



