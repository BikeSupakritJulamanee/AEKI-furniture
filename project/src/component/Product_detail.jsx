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
    const [f_product, setf_product] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [select_qrt, setselect_qrt] = useState(1);
    const [productData, setProductData] = useState({
        id: searchParams.get("id") || "",
        name: searchParams.get("name") || "",
        description: searchParams.get("description") || "",
        quantity: searchParams.get("quantity"),
        price: searchParams.get("price") || "",
        image: searchParams.get("image") || "",
        attribute: searchParams.get("attribute") || "",
    });

    useEffect(() => {
        fetchCart();
        fetchProduct();
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

    const fetchProduct = async () => {
        try {
            const q = query(collection(db, 'products'));

            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setf_product(newData);
            console.log(f_product)
        } catch (error) {
            console.error('Error fetching account data:', error);
        }
    };

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
        }
    };

    const handlebuy = async (productId, qrt) => {
        setLoading(true)
        try {
            if (homecart.length === 0) {
                console.error("Cart not found.");
                return;
            }
            const cartID = homecart[0].id;
            const cartDocRef = doc(db, "cart", cartID);

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

                    if (parseInt(qrt) <= parseInt(productData.quantity)) {
                        await updateDoc(cartDocRef, { qauntityPerProductID: updatedQrt, product_id: updatedProductIds });
                        console.log("Product added to cart successfully!");
                    } else {
                        alert("สินค้าไม่เพียงพอ")
                    }
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
                <div style={{ textAlign: 'right' }}></div>
                <Row>
                    <Col md={10} className="sizecon">
                        <div className="contact_inner">
                            <Row>
                                <Col md={10}>

                                    <div className="contact_form_inner">
                                        <div className="contact_field">

                                            <h3>{productData.name}</h3>

                                            <div>{productData.description}</div>

                                            <div>{productData.attribute}</div>

                                            {/* amount stock */}
                                            {f_product.map((product) => (
                                                product.id === productData.id && (
                                                    <h6>จำนวนคงเหลือ:{product.quantity}</h6>
                                                )
                                            ))}

                                            {/* real time price */}
                                            <div>
                                                {(e) =>
                                                    setProductData({
                                                        ...productData,
                                                        price: e.target.value,
                                                    })
                                                }
                                                <h5>ราคา:{(productData.price * select_qrt).toLocaleString()}บาท</h5>
                                            </div>

                                            <Form onSubmit={(e) => handlebuy(productData.id, select_qrt, e)} >

                                                {/* quantity form */}
                                                <Form.Group>
                                                    <Form.Label>จำนวน</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="จำนวน"
                                                        value={select_qrt}
                                                        onChange={(e) =>
                                                            setselect_qrt(e.target.value)
                                                        }
                                                        min={1}
                                                        pattern="+"
                                                    />
                                                </Form.Group>

                                                <br />
                                                <Button variant="warning" type="submit" className="contact_form_submit" disabled={isLoading}>
                                                    เพิ่มในตะกร้าสินค้า
                                                </Button>

                                            </Form>

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