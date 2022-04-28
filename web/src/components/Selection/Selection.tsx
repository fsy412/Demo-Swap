import React, { SyntheticEvent } from 'react'
import { Dropdown, DropdownButton } from "react-bootstrap"
import "./selection.scss"

const Selection = ({
    dir,
    onSelectChain,
    onTokenSelect,
    chain,
    setInput,
    amount,
    onMaxClick
}: {
    dir: string;
    onSelectChain: (eventKey: any, e: SyntheticEvent<EventTarget, Event>) => void;
    onTokenSelect: (eventKey: any, e: SyntheticEvent<EventTarget, Event>) => void;
    chain: string;
    setInput: (e: React.FormEvent<HTMLInputElement>) => void;
    amount: string;
    onMaxClick: () => void;
}) => {
    const getChainImg = (chain: string) => {
        if (chain == "BSCTEST") {
            return "https://anyswap.exchange/static/media/BNB.c6c25fc0.svg"
        } else if (chain == "RINKEBY") {
            return "https://anyswap.exchange/static/media/ETH.cec4ef9a.svg"
        }
    }
    return (
        <div className="selectionGroup">
            <div className="fromGroup">
                <div className="textFrom">
                    <span>{dir}</span>
                </div>
                <div className="dropdownWrapper">
                    <DropdownButton
                        variant="outline-secondary"
                        title={
                            <span>
                                <img src={getChainImg(chain)} /> {chain}
                            </span>
                        }
                        id="input-group-dropdown-1"
                        onSelect={onSelectChain}
                    >

                        <Dropdown.Item href="#">
                            <span ><img className="imgWrapper" src="https://anyswap.exchange/static/media/BNB.c6c25fc0.svg" />BSCTEST</span>
                        </Dropdown.Item>
                        <Dropdown.Item href="#">
                            <span ><img src="https://anyswap.exchange/static/media/ETH.cec4ef9a.svg" />RINKEBY</span>
                        </Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>

            <div className="selectionBox" >
                <div className="balanceInfo">
                    <div>
                        <span>
                            {dir == "from" ? "Send" : "Receive"}
                        </span>
                    </div>
                    <div>
                        <span onClick={onMaxClick}>
                            max
                        </span>
                    </div>
                </div>
                <div className="selectionWrapper">
                    <div className="inputWrapper"><input pattern="[0-9]*" type="number" onChange={setInput} value={amount} placeholder={"0.0"} onWheel={event => event.currentTarget.blur()} /></div>
                    <div className="menuWrapper">
                        <DropdownButton
                            variant="outline-secondary"
                            title={
                                <span>
                                    <img src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png" /> USDC
                                </span>
                            }
                            id="input-group-dropdown-2"
                            // align="end"
                            onSelect={onTokenSelect}
                            className="shadow-none"
                        >
                            <Dropdown.Item href="#">
                                <span ><img src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png" />USDC</span>
                            </Dropdown.Item>
                        </DropdownButton>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default Selection
