import React from 'react'
import { ToastContainer, Toast as ReactToast } from 'react-bootstrap'

export const Toast = () => {
    return (
        <div>
            <ToastContainer position="top-end" className="p-2">
                <ReactToast>
                    <ReactToast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Bootstrap</strong>
                        <small>11 mins ago</small>
                    </ReactToast.Header>
                    <ReactToast.Body>Hello, world! This is a toast message.</ReactToast.Body>
                </ReactToast>
            </ToastContainer>
        </div>
    )
}

export default Toast;