import React, { useState, useRef } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';

export const HashModal = ({
    showModal,
    onHide,
    onConfirm,
}: {
    showModal: boolean;
    onHide: () => void;
    onConfirm: (string) => void;
}) => {
    const refInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Modal show={showModal} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Hash Lock</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control ref={refInput} type="text" placeholder="Input lock word" autoFocus />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { onConfirm(refInput.current?.value) }}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default HashModal;