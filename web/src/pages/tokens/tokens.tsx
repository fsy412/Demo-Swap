import React from 'react'
import { Container, Dropdown, Table, Row, Col, Toast, DropdownButton, InputGroup, FormGroup, FormControl } from "react-bootstrap"
import { useEffect, useState, useContext, useRef } from "react";
import { getChainImg, getTokenAddr, formatNumber, getTokenName, changeNetwork } from "../../util/util"
import "./tokens.scss"

export const Tokens = () => {
    return (
        <Container className="container-fluid">

            <Table bordered hover borderless variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Chain</th>
                        <th>DANT Token</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td className="">{<span><img className='chainImg' src={getChainImg("BSCTEST")}></img>BSCTEST</span>}</td>
                        <td>{getTokenAddr("BSCTEST", "DANT")}</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td className="">{<span><img className='chainImg' src={getChainImg("RINKEBY")}></img>RINKEBY</span>}</td>
                        <td>{getTokenAddr("RINKEBY", "DANT")}</td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    )
}

export default Tokens
