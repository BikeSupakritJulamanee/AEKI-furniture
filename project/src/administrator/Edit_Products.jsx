import React, { useState, useEffect } from "react";
import { Container, Button, Form, Image, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import {
  query,
  collection,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storageRef } from "../firebase";
import Nav from "./Nav";


function EditProducts() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id");

  const [productData, setProductData] = useState({
    id: searchParams.get("id") || "",
    name: searchParams.get("name") || "",
    description: searchParams.get("description") || "",
    quantity: searchParams.get("quantity") || "",
    price: searchParams.get("price") || "",
    image: searchParams.get("image") || "",
  });

  const [imageUpload, setImageUpload] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUpload(file);
    }
  };

  const updateUserField = async (property, value) => {
    const querySnapshot = await getDocs(
      query(collection(db, "products"), where("name", "==", productData.name))
    );

    if (!querySnapshot.empty) {
      const productRef = querySnapshot.docs[0].ref;
      await updateDoc(productRef, { [property]: value });
    }

    if (imageUpload) {
      const imageRef = ref(storageRef, `products/${imageUpload.name}`);
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);
      setProductData((prevData) => ({ ...prevData, img: url }));
    }
  };

  const handleDelete = async () => {
    try {
      const productDocRef = doc(db, "products", productData.id);
      await deleteDoc(productDocRef);
      console.log("Document successfully deleted!");
      alert("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Error deleting document: " + error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateUserField("name", productData.name);
    await updateUserField("description", productData.description);
    await updateUserField("quantity", productData.quantity);
    await updateUserField("price", productData.price);
    alert("Updated");
  };

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

  return (
    <>
      <Nav />
      <Container>
        <Row>
          <Col md={10} className="sizecon">
            <div className="contact_inner">
              <Row>
                <Col md={10}>
                  <div className="contact_form_inner">
                    <div className="contact_field">
                      <h3>แก้ไขผลิตภัณฑ์</h3>
                      <p>ทำการแก้ไขสินค้า</p>
                      <Form onSubmit={handleUpdate}>
                        <Form.Group>
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Name"
                            value={productData.name}
                            onChange={(e) =>
                              setProductData({
                                ...productData,
                                name: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Description"
                            value={productData.description}
                            onChange={(e) =>
                              setProductData({
                                ...productData,
                                description: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
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
                        <Form.Group>
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Price"
                            value={productData.price}
                            onChange={(e) =>
                              setProductData({
                                ...productData,
                                price: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Image</Form.Label>
                          <Form.Control
                            type="file"
                            onChange={handleFileChange}
                          />
                        </Form.Group>
                        <br />
                        <Button
                          type="submit"
                          className="contact_form_submit"
                          variant="success"
                        >
                          Update
                        </Button>
                        <Button
                          onClick={handleDelete}
                          className="contact_form_submit2"
                          variant="danger"
                        >
                          delete
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
    </>
  );
}

export default EditProducts;
