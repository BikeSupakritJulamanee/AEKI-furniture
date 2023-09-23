import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from '../firebase'; // Assuming you're importing the Firebase configuration correctly
import Nav from './Nav';
import { Button, Container } from "react-bootstrap";
import { doc, getDoc } from 'firebase/firestore';

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
    });

    const [recipientAddy_ID, setRecipientAddy_ID] = useState(null);
    const [transportation_ID, setTransportation_ID] = useState(null);
    const [productID_ID, setProductID] = useState([]);
    const [productID_Detail, setProductID_Detail] = useState([]);

    // Fetch product IDs as an array
    useEffect(() => {
        const productIDs = ShippingData.productID.split(",");
        setProductID(productIDs);
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

    return (
        <>
            <Nav />
            <Container>
                {recipientAddy_ID && recipientAddy_ID.id}
                {recipientAddy_ID && recipientAddy_ID.gmail} <br />
                {transportation_ID && transportation_ID.id}
                {transportation_ID && transportation_ID.transportCompanyName} <br />

                {productID_Detail.map((product, index) => (
                    <div key={index}>
                        Product ID: {product.id} <br />
                        {product.name}
                    </div>
                ))}

                {productID_ID.length} <br /> {productID_Detail.length}
            </Container>
        </>
    );
}

export default ViewOrder;
