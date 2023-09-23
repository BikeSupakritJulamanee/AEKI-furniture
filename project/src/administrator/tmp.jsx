import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import { Container, Table, Button, Form } from 'react-bootstrap';
import { db } from '../firebase';
import {
    query,
    collection,
    getDocs,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';



function Order_List() {
    const [order, setOrder] = useState([]);
    const [state, setState] = useState([]);

    const [select, setSelect] = useState('');

    const fetchState = async () => {
        try {
            const q = query(collection(db, 'state')).where('status', '==', select);
            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setState(newData);
        } catch (error) {
            console.error('Error fetching order data:', error);
        }
    };

    const fetchOrder = async () => {
        try {
            const q = query(collection(db, 'order'));
            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOrder(newData);
        } catch (error) {
            console.error('Error fetching order data:', error);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    useEffect(() => {
        fetchState();
    }, [select]);


    return (
        <>
            <Nav />
            <Container>
                <Form.Select
                    aria-label='Default select example'
                    onChange={(e) => setSelect(e.target.value)}
                >
                    <option value='สั่งซื้อเเล้ว'>สั่งซื้อเเล้ว</option>
                    <option value='กำลังจัดส่ง'>กำลังจัดส่ง</option>
                    <option value='จัดส่งสำเร็จ'>จัดส่งสำเร็จ</option>
                </Form.Select>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>Gmail</th>
                            <th>Product ID</th>
                            <th>Quantity per Product ID</th>
                            <th>Amount + shipping cost</th>
                            <th>Transport Company Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.map((o, index) => (
                            <tr key={index}>
                                <td>{o.id}</td>
                                <td>{o.gmail}</td>
                                <td>
                                    {Array.isArray(o.productID) &&
                                        o.productID.map((productId, i) => (
                                            <div key={i}>{productId}</div>
                                        ))}
                                </td>
                                <td>
                                    {Array.isArray(o.quantityPerProductID) &&
                                        o.quantityPerProductID.map((quantity, i) => (
                                            <div key={i}>{quantity}</div>
                                        ))}
                                </td>
                                <td>{o.amount}</td>
                                <td></td>
                                <td><Button variant='dark' >commit</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}

export default Order_List;
