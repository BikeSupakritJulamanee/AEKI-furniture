import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from '../firebase'; // Assuming you're importing the Firebase configuration correctly
import Nav from './Nav';
import { Button, Container, Image, Row, Col } from "react-bootstrap";
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storageRef } from "../firebase";


function ViewOrder() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [ShippingData, setShippingData] = useState({
        orderID: searchParams.get("orderID") || "",
        gmail: searchParams.get("gmail") || "",
        recipientAddyID: searchParams.get("recipientAddyID") || "",
        transportationID: searchParams.get("transportationID") || "",
        productID: searchParams.get("productID") || "",
        quantityPerProductID: searchParams.get("quantityPerProductID") || "",
        amount: searchParams.get("amount") || "",
    });

    const [recipientAddy_ID, setRecipientAddy_ID] = useState(null);
    const [transportation_ID, setTransportation_ID] = useState(null);
    const [productID_ID, setProductID] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [productID_Detail, setProductID_Detail] = useState([]);

    // Fetch product IDs as an array
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

    const [imageList, setImageList] = useState([]);
    useEffect(() => {
        const imageListRef = ref(storageRef, "products/");
        listAll(imageListRef)
            .then((response) =>
                Promise.all(response.items.map((item) => getDownloadURL(item)))
            )
            .then((urls) => setImageList(urls))
            .catch((error) => console.error("Error listing images:", error));
    }, []);

    const [imageList2, setImageList2] = useState([]);
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
                <Row>
                    <Col>
                        <b>รายการสั่งซื้อ</b>
                        {productID_Detail.map((product, index) => (
                            <Row key={index}>
                                <Col>
                                    <Image width={200} height={160}
                                        src={imageList.find((url) => url.includes(product.img))}
                                    />
                                </Col>
                                <Col>
                                    รหัสสินค้า: {product.id} <br />
                                    ชื่อสินค้า: {product.name} <br />
                                    ราคาสินค้าต่อชิ้น: {product.price} <br />
                                    จำนวน: {quantity[index]}
                                </Col>
                            </Row>
                        ))}
                    </Col>
                    <Col>
                        <b>ส่วนผู้รับ</b> <br />
                        ผู้ใช้: {ShippingData.gmail} <br />
                        ผู้รับ: {recipientAddy_ID && recipientAddy_ID.recipientName} <br />
                        ติดต่อ: {recipientAddy_ID && recipientAddy_ID.phoneNumber} <br />
                        ที่อยู่การจัดส่ง: {recipientAddy_ID && recipientAddy_ID.destination} <br />

                        <br /><br />
                        <b>การจัดส่ง</b> <br />
                        {transportation_ID && (
                            <>
                                บริษัท: {transportation_ID.transportCompanyName} <br />
                                ค่าบริการ: {transportation_ID.shippingCost} <br />
                                {transportation_ID.img && (
                                    <Image width={100} height={80}
                                        src={imageList2.find((url) => url.includes(transportation_ID.img))}
                                    />
                                )}
                            </>
                        )}

                        <br /><br />
                        ยอดต้องชำระ: {ShippingData.amount} บาท

                        <br /><br />
                        <Button href="/order_list" >ย้อนกลับ</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ViewOrder;
