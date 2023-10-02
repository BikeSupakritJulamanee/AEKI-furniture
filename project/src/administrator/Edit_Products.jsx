import React, { useState, useEffect } from "react";
import { Container, Button, Form, Image, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { query, collection, getDocs, doc, deleteDoc, writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import Nav from "./Nav";
import "./style/product_forrm.css";
import { db, storageRef } from "../firebase";


function EditProducts() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("id");
  const [imageList, setImageList] = useState([]);
  const [productTypeList, setProductTypeList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    id: productId || "",
    name: searchParams.get("name") || "",
    description: searchParams.get("description") || "",
    quantity: searchParams.get("quantity") || "",
    price: searchParams.get("price") || "",
    image: searchParams.get("image") || "",
    type: searchParams.get("type") || "",
    attribute: searchParams.get("attribute") || "",
  });

  useEffect(() => {
    fetchType();
    const imageListRef = ref(storageRef, "products/");
    listAll(imageListRef)
      .then((response) =>
        Promise.all(response.items.map((item) => getDownloadURL(item)))
      )
      .then((urls) => setImageList(urls))
      .catch((error) => console.error("Error listing images:", error));
  }, []);

  const fetchType = async () => {
    try {
      const q = query(collection(db, 'type'));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setProductTypeList(newData);
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  const handleUpdate = async (e) => {
    setLoading(true)
    e.preventDefault();

    const batch = writeBatch(db);

    const productRef = doc(db, "products", productId);
    batch.update(productRef, {
      name: productData.name,
      description: productData.description,
      quantity: parseInt(productData.quantity),
      price: parseInt(productData.price),
      type: productData.type,
      attribute: productData.attribute
    });

    if (imageUpload) {
      // Upload the image
      const imageRef = ref(storageRef, `products/${imageUpload.name}`);
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);
      setImageList((prev) => [...prev, url]);
      batch.update(productRef, { img: fileName });
    }

    try {
      await batch.commit(); // Commit all updates in the batch
      alert("เเก้ไขข้อมูลผลิตภัณฑ์สำเร็จ");
      setLoading(true)
      window.close();
    } catch (error) {
      console.error("Error updating fields:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const productDocRef = doc(db, "products", productId);
      await deleteDoc(productDocRef);
      console.log("Document successfully deleted!");
      alert("ลบผลิตภัณฑ์สำเร็จ");
      window.close();
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Error deleting document: " + error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setImageUpload(file);
    }
  };

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
                          <Form.Label>ชื่อสินค้า</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Name"
                            value={productData.name}
                            onChange={(e) =>
                              setProductData({ ...productData, name: e.target.value })
                            }
                            required
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>คำอธิบาย</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Description"
                            value={productData.description}
                            onChange={(e) =>
                              setProductData({ ...productData, description: e.target.value })
                            }
                            required
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>จำนวน</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Quantity"
                            value={productData.quantity}
                            onChange={(e) =>
                              setProductData({ ...productData, quantity: e.target.value })
                            }
                            required
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>ราคา</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Price"
                            value={productData.price}
                            onChange={(e) =>
                              setProductData({ ...productData, price: e.target.value })
                            }
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="exampleForm.SelectCustom">
                          <Form.Label>ประเภทสินค้า</Form.Label>
                          <Form.Control
                            as="select"
                            className="input-small"
                            placeholder="Type"
                            value={productData.type}
                            onChange={(e) =>
                              setProductData({ ...productData, type: e.target.value })
                            }
                            required
                          >
                            {productTypeList.map((typeObj, index) => (
                              <option key={index} value={typeObj.productType}>
                                {typeObj.productType}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>รูปภาพสินค้า</Form.Label>
                          <Form.Control
                            className="input-small"
                            type="file"
                            onChange={handleFileChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>คุณลักษณะ</Form.Label>
                          <Form.Control
                            className="input-small"
                            placeholder="Attribute"
                            as="textarea"
                            value={productData.attribute}
                            required
                            style={{
                              height: '150px',
                            }}
                            onChange={(e) =>
                              setProductData({ ...productData, attribute: e.target.value })
                            }
                          />
                        </Form.Group>
                        <br />
                        <Button variant="success" className="contact_form_submit" type="submit" disabled={isLoading}>
                          {isLoading ? 'Loading…' : 'Update'}
                        </Button>
                        <Button
                          onClick={handleDelete}
                          className="contact_form_submit2"
                          variant="danger"
                        >
                          Delete
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