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

    return (
        <>
            <Nav />
            <Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>gmail</th>
                            <th>Product ID</th>
                            <th>Quantity per Product ID</th>
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
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}

export default Order_List;
