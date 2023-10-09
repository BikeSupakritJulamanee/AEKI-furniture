import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from '../firebase'; // Assuming you're importing the Firebase configuration correctly
import Nav from './Nav';
import { Button, Container, Image, Row, Col, Table } from "react-bootstrap";
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storageRef } from "../firebase";


function ViewOrder() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [recipientAddy_ID, setRecipientAddy_ID] = useState(null);
    const [transportation_ID, setTransportation_ID] = useState(null);
    const [productID_ID, setProductID] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [productID_Detail, setProductID_Detail] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [imageList2, setImageList2] = useState([]);
    const [ShippingData, setShippingData] = useState({
        orderID: searchParams.get("orderID") || "",
        email: searchParams.get("email") || "",
        recipientAddyID: searchParams.get("recipientAddyID") || "",
        transportationID: searchParams.get("transportationID") || "",
        productID: searchParams.get("productID") || "",
        quantityPerProductID: searchParams.get("quantityPerProductID") || "",
        amount: searchParams.get("amount") || "",
    });

    useEffect(() => {
        const productIDs = ShippingData.productID.split(",");
        const quantityPerProduct = ShippingData.quantityPerProductID.split(",");
        setProductID(productIDs);
        setQuantity(quantityPerProduct);
    }, [ShippingData.productID]);

    const fetchProductDetails = async () => {
        const productDetails = [];

        for (let i = 0; i < productID_ID.length; i++) {
            const q = doc(db, 'products', productID_ID[i]);
            const r = await getDoc(q);

            if (r.exists()) {
                const Data = {
                    id: r.id,
                    ...r.data(),
                };
                productDetails.push(Data);
            }
        }

        setProductID_Detail(productDetails);
    };

    useEffect(() => {
        async function fetchRecipientAddy() {
            const recipientAddy = doc(db, 'recipientAddy', ShippingData.recipientAddyID);
            const recipientAddyDoc = await getDoc(recipientAddy);
            if (recipientAddyDoc.exists()) {
                const Data = {
                    id: recipientAddyDoc.id,
                    ...recipientAddyDoc.data(),
                };
                setRecipientAddy_ID(Data);
            }
        }

        fetchRecipientAddy();
    }, [ShippingData.recipientAddyID]);

    useEffect(() => {
        async function fetchTransportation() {
            const transportation = doc(db, 'transportation', ShippingData.transportationID);
            const transportationDoc = await getDoc(transportation);
            if (transportationDoc.exists()) {
                const Data = {
                    id: transportationDoc.id,
                    ...transportationDoc.data(),
                };
                setTransportation_ID(Data);
            }
        }

        fetchTransportation();
    }, [ShippingData.transportationID]);

    useEffect(() => {
        if (productID_ID.length > 0) {
            fetchProductDetails();
        }
    }, [productID_ID]);

    useEffect(() => {
        const imageListRef = ref(storageRef, "products/");
        listAll(imageListRef)
            .then((response) =>
                Promise.all(response.items.map((item) => getDownloadURL(item)))
            )
            .then((urls) => setImageList(urls))
            .catch((error) => console.error("Error listing images:", error));
    }, []);

    useEffect(() => {
        const imageListRef = ref(storageRef, "transaction/");
        listAll(imageListRef)
            .then((response) =>
                Promise.all(response.items.map((item) => getDownloadURL(item)))
            )
            .then((urls) => setImageList2(urls))
            .catch((error) => console.error("Error listing images:", error));
    }, []);

    return (
        <>
            <Nav />
            <Container>
                <br />
                <h4>รหัสคำสั่งซื้อ:{ShippingData.orderID}</h4>
                <br />
                <Table bordered>
                    <thead bordered striped responsive >
                        <tr>
                            <th>ส่วนของผู้รับ</th>
                            <th>การจัดส่ง</th>
                            <th>ค่าบริการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                ผู้สั่ง: {ShippingData.email} <br />
                                ผู้รับ: {recipientAddy_ID && recipientAddy_ID.recipientName} <br />
                                ติดต่อ: {recipientAddy_ID && recipientAddy_ID.phoneNumber} <br />
                                ที่อยู่การจัดส่ง: {recipientAddy_ID && recipientAddy_ID.destination} <br />
                            </td>
                            <td>
                                {transportation_ID && (
                                    <>
                                        บริษัท: {transportation_ID.transportCompanyName} <br />
                                        ค่าบริการ: {transportation_ID.shippingCost} <br />
                                        {transportation_ID.img && (
                                            <Image
                                                width={100}
                                                height={80}
                                                src={imageList2.find((url) => url.includes(transportation_ID.img))}
                                            />
                                        )}
                                    </>
                                )}
                            </td>
                            <td>
                                ยอดต้องชำระ: {ShippingData.amount} บาท
                            </td>
                        </tr>
                    </tbody>
                </Table>

                <Table bordered responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>รายการสั่งซื้อ</th>
                            <th>รายละเอียด</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productID_Detail.map((product, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td><Image
                                    width={200}
                                    height={160}
                                    src={imageList.find((url) => url.includes(product.img))}
                                /></td>
                                <td>
                                    รหัสสินค้า: {product.id} <br />
                                    ชื่อสินค้า: {product.name} <br />
                                    ราคาสินค้าต่อชิ้น: {product.price} <br />
                                    จำนวน: {ShippingData.quantityPerProductID}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}
export default ViewOrder;