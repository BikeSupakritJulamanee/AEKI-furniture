import React, { useState, useEffect } from "react";
import { Container, Button, Form, Image, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import Nav_Bar from "../component/Nav_Bar";
import {
    getDocs,
    collection,
    query,
    where,
    orderBy,
    writeBatch,
    doc,
    updateDoc,
    getDoc, // Add this import for getDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storageRef } from "../firebase";
import { useUserAuth } from "../context/UserAuthContext";

function Product_detail() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("id");
    const [imageList, setImageList] = useState([]);
    const { user, logOut } = useUserAuth();
    const [homecart, sethomecart] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [productData, setProductData] = useState({
        id: searchParams.get("id") || "",
        name: searchParams.get("name") || "",
        description: searchParams.get("description") || "",
        quantity: searchParams.get("quantity"),
        price: searchParams.get("price") || "",
        image: searchParams.get("image") || "",
    });

    useEffect(() => {
        fetchCart();
    }, [user]);

    useEffect(() => {
        const imageListRef = ref(storageRef, "products/");
        listAll(imageListRef)
            .then((response) =>
                Promise.all(response.items.map((item) => getDownloadURL(item)))
            )
            .then((urls) => setImageList(urls))
            .catch((error) => console.error("Error listing images:", error));
    }, []);

    const fetchCart = async () => {
        if (user.email) {
            const q = query(
                collection(db, "cart"),
                where("email", "==", user.email)
            );


            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            sethomecart(newData);

            // You don't need to set cartID here.
        }
    };

    const handlebuy = async (productId, qrt) => {
        setLoading(true)
        try {
            if (homecart.length === 0) {
                console.error("Cart not found.");
                return;
            }

            // Assuming you want to work with the first cart found.
            const cartID = homecart[0].id;
            const cartDocRef = doc(db, "cart", cartID);

            // Get the current cart data
            const cartDocSnapshot = await getDoc(cartDocRef);
            const currentCartData = cartDocSnapshot.data();


            if (typeof currentCartData.qauntityPerProductID === 'object') {

                if (currentCartData.qauntityPerProductID.hasOwnProperty(productId)) {

                    const updatedQrt = {
                        ...currentCartData.qauntityPerProductID,
                        [productId]: currentCartData.qauntityPerProductID[productId] + parseInt(qrt),
                    };

                    await updateDoc(cartDocRef, { qauntityPerProductID: updatedQrt });

                    console.log("Product quantity updated in cart successfully!");
                } else {

                    const updatedProductIds = [...currentCartData.product_id, productId];
                    const updatedQrt = {
                        ...currentCartData.qauntityPerProductID,
                        [productId]: parseInt(qrt),
                    };

                    await updateDoc(cartDocRef, { qauntityPerProductID: updatedQrt, product_id: updatedProductIds });

                    console.log("Product added to cart successfully!");
                }
            } else {
                console.error("Invalid 'qauntityPerProductID' field in cart document.");
            }
        } catch (error) {
            console.error("Error adding/updating product quantity in cart:", error);
        }
        setLoading(false)
    };

    return (
        <div>
            <Nav_Bar />
            <Container>
            <div style={{ textAlign: 'right' }}><Link to="/home">เลือกสินค้าต่อ</Link></div>
                <Row>
                    <Col md={10} className="sizecon">
                        <div className="contact_inner">
                            <Row>
                                <Col md={10}>
                                    <div className="contact_form_inner">
                                        <div className="contact_field">
                                            <h3>{productData.name}</h3>

                                            <h4>Description:</h4>
                                            <div><h5>{productData.description}</h5></div>


                                            <Form.Group>
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Quantity"
                                                    value={productData.quantity}
                                                    onChange={(e) =>
                                                        setProductData({
                                                            ...productData,
                                                            quantity: e.target.value,
                                                        })
                                                    }
                                                />
                                            </Form.Group>
                                            <h4>Price:</h4>
                                            <div>

                                                {(e) =>
                                                    setProductData({
                                                        ...productData,
                                                        price: e.target.value,
                                                    })
                                                }
                                                <h5>{productData.price * productData.quantity}</h5>
                                            </div>

                                            <br />
                                            <Button variant="warning" className="contact_form_submit" disabled={isLoading} onClick={() => handlebuy(productData.id, productData.quantity)}  >
                                                ADD TO CART
                                            </Button>

                                        </div>
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className="right_conatct_social_icon d-flex align-items-end"></div>
                                </Col>
                            </Row>
                            <div>
                                <Image
                                    className="resize3"
                                    src={imageList.find((url) => url.includes(productData.image))}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Product_detail