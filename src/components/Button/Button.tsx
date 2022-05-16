import React from 'react'
import "./Button.scss"
import { Spinner } from 'react-bootstrap'

export const Button: React.FC<{
    display: string;
    spinner: boolean;
    onclick: () => Promise<void>;
    disable: boolean;
}> = ({ display, spinner, onclick, disable }) => {
    return (
        <button disabled={disable} onClick={() => { onclick() }} className="createButton">{display}{spinner ? (<Spinner className="spinner" animation="border" />) : null} </button>
    )
}

export default Button;