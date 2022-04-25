import React from 'react'
import { Dropdown, DropdownButton } from "react-bootstrap"
import "./selection.scss"

const Selection = () => {
    return (
        <>
             <div className="selectionGroup">
                <div className="fromGroup">
                    <div className="textFrom">
                        <span>From</span>
                    </div>
                    <div className="dropdownWrapper">
                        <DropdownButton
                            variant="outline-secondary"
                            title={
                                <span>
                                    <img src="https://anyswap.exchange/static/media/BNB.c6c25fc0.svg" /> BSCTEST
                                </span>
                            }
                            id="input-group-dropdown-1"
                        >

                            <Dropdown.Item href="#">
                                <div ><img src="https://anyswap.exchange/static/media/BNB.c6c25fc0.svg" /></div>
                                <div>BSCTEST</div>
                            </Dropdown.Item>
                            <Dropdown.Item href="#">
                                <div ><img src="https://anyswap.exchange/static/media/ETH.cec4ef9a.svg" /></div>
                                <div>RINKEBY</div>
                            </Dropdown.Item>
                        </DropdownButton>
                    </div>
                </div>

                <div className="SelectionBox" >
                    <div className="balanceInfo">
                        <div>
                            <span>
                                Send
                            </span>
                        </div>
                        <div>
                            <span>
                                max
                            </span>
                        </div>
                    </div>
                    <div className="selectionWrapper">
                        <div>
                            <div className="inputWrapper"><input /></div>
                        </div>
                        <div className="menuWrapper">
                            <div className="menu">
                                <DropdownButton
                                    variant="outline-secondary"
                                    title="Dropdown"
                                    id="input-group-dropdown-2"
                                    align="end"
                                >
                                    <Dropdown.Item href="#">Action</Dropdown.Item>
                                    <Dropdown.Item href="#">Another action</Dropdown.Item>
                                    <Dropdown.Item href="#">Something else here</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="#">Separated link</Dropdown.Item>
                                </DropdownButton></div>
                        </div>
                    </div>
                </div>
            </div >  
        </>
    )
}

export default Selection
