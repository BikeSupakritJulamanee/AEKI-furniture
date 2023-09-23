import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import { Container, Table, Form, Button } from 'react-bootstrap';
import { db } from '../firebase';
import {
    collection,
    query,
    where,
    getDocs,
    doc, // Corrected function name
    getDoc,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Order_List() {
    const [state, setState] = useState([]);
    const [select, setSelect] = useState('');

    const fetchState = async () => {
        try {
            const q = query(
                collection(db, 'state'),
                where('status', '==', select)
            );
            const querySnapshot = await getDocs(q);
            const newData = [];

            for (const docSnap of querySnapshot.docs) { // Renamed the variable to avoid conflict with the 'doc' function
                const stateData = {
                    id: docSnap.id,
                    ...docSnap.data(),
                };

                // Fetch order data using auto-generated orderID
                const orderID = stateData.orderID;
                const orderRef = doc(db, 'order', orderID); // Corrected function name
                const orderDoc = await getDoc(orderRef);

                if (orderDoc.exists()) {
                    const orderData = {
                        id: orderDoc.id,
                        ...orderDoc.data(),
                    };
                    stateData.order = orderData;
                    newData.push(stateData);
                }
            }

            setState(newData);
        } catch (error) {
            console.error('Error fetching state data:', error);
        }
    };

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
                    <option value=''>สถานะ</option>
                    <option value='สั่งซื้อเเล้ว'>สั่งซื้อเเล้ว</option>
                    <option value='กำลังเตรียมพัสดุ'>กำลังเตรียมพัสดุ</option>
                    <option value='จัดส่งสำเร็จ'>จัดส่งสำเร็จ</option>
                </Form.Select> <hr />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>รหัสคำสั่งซื้อ</th>
                            <th>ผู้สั่งซื้อ</th>
                            <th>ที่อยู่ผู้รับ</th>
                            <th>ยอดต้องชำระ + ค่าขนส่ง</th>
                            <th>ใช้บริการขนส่ง</th>
                            <th>รหัสสินค้า</th>
                            <th>จำนวน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.map((s, index) => (
                            <tr key={index}>
                                <td>{s.order.id}</td>
                                <td>{s.order.gmail}</td>
                                <td>{s.recipientAddyID}</td>
                                <td>{s.order.amount}</td>
                                <td>{s.transportationID}</td>
                                <td>{Array.isArray(s.order.productID) &&
                                    s.order.productID.map((productId, i) => (
                                        <div key={i}>{productId}</div>
                                    ))}
                                </td>
                                <td>{Array.isArray(s.order.quantityPerProductID) &&
                                    s.order.quantityPerProductID.map((productId, i) => (
                                        <div key={i}>{productId}</div>
                                    ))}
                                </td>
                                <td><Button variant='dark' >Submit</Button></td>
                                <td> <Link
                                    to={`/view_order?orderID=${encodeURIComponent(s.order.id)}&gmail=${encodeURIComponent(
                                        s.order.gmail
                                    )}&recipientAddyID=${encodeURIComponent(s.recipientAddyID)}&amount=${encodeURIComponent(
                                        s.order.amount
                                    )}&transportationID=${encodeURIComponent(s.transportationID)}&productID=${encodeURIComponent(
                                        s.order.productID
                                    )}&quantityPerProductID=${encodeURIComponent(s.order.quantityPerProductID)}`}
                                    target="_blank"
                                    key={index}
                                >view</Link></td>
                            </tr>

                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}

export default Order_List;
