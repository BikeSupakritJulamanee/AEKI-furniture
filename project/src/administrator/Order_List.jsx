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
    updateDoc
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Order_List() {
    const [shipping, setShipping] = useState([]);
    const [select, setSelect] = useState('');
    const [lock, setLock] = useState(false)

    useEffect(() => {
        if (select == 'จัดส่งสำเร็จ') {
            setLock(true)
        }
        else {
            setLock(false)
        }
        fetchState();
    }, [select]);

    const handleEditSubmit = async (id) => {
        const companyDocRef = doc(db, 'shipping', id);
        await updateDoc(companyDocRef, {
            status: 'จัดส่งสำเร็จ'
        });
        alert('Success')
    };

    const fetchState = async () => {
        try {
            const q = query(
                collection(db, 'shipping'),
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

            setShipping(newData);
        } catch (error) {
            console.error('Error fetching state data:', error);
        }
    };

    return (
        <>
            <Nav />
            <Container>
                <br />
                <center><h1>รายการสั่งซื้อ</h1></center>

                <Form.Group>
                    <Form.Select
                        className="dropdown-small select_productType"
                        placeholder="Type"
                        onChange={(e) => setSelect(e.target.value)}
                        required
                    >
                        <option value={''}>สถานะ</option>
                        <option value='รอดำเนินการจัดส่ง'>รอดำเนินการจัดส่ง</option>
                        <option value='จัดส่งสำเร็จ'>จัดส่งสำเร็จ</option>
                    </Form.Select>
                </Form.Group>

                <br /><br />
                <Table hover responsive>
                    <thead>
                        <tr>
                            <th>รหัสคำสั่งซื้อ</th>
                            <th>ผู้สั่งซื้อ</th>
                            <th>รหัสที่อยู่ผู้รับ</th>
                            <th>ยอดต้องชำระ</th>
                            <th>รหัสบริการขนส่ง</th>
                            <th>รหัสสินค้า</th>
                            <th>จำนวน</th>
                            <th color='red'>เปลี่ยนสถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipping.map((s, index) => (
                            <tr key={index}>
                                <td>{s.order.id}</td>
                                <td>{s.order.email}</td>
                                <td>{s.recipientAddyID}</td>
                                <td>{s.order.amount}</td>
                                <td>{s.transportationID}</td>
                                <td>
                                    {Array.isArray(s.order.product_id) &&
                                        s.order.product_id.map((product_id, i) => (
                                            <div key={i}>{product_id}</div>
                                        ))}
                                </td>
                                {s.order.quantityPerProductID &&
                                    Object.entries(s.order.quantityPerProductID).map(([productId, quantity], i) => (
                                        <div key={i}>
                                           {quantity}
                                        </div>
                                    ))}
                                <td>
                                    <Button disabled={lock} onClick={() => handleEditSubmit(s.id)}>
                                        ทำการจัดส่ง
                                    </Button>
                                </td>
                                <td>
                                    <Link
                                        to={`/view_order?orderID=${encodeURIComponent(s.order.id)}&email=${encodeURIComponent(
                                            s.order.email
                                        )}&recipientAddyID=${encodeURIComponent(s.recipientAddyID)}&amount=${encodeURIComponent(
                                            s.order.amount
                                        )}&transportationID=${encodeURIComponent(s.transportationID)}&productID=${encodeURIComponent(
                                            s.order.product_id
                                        )}&quantityPerProductID=${encodeURIComponent(
                                            s.order.quantityPerProductID
                                        )}`}
                                        target="_blank"
                                        key={index}
                                    >
                                        view
                                    </Link>
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
