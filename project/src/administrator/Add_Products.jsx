import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Form,
  Row,
  Col,
  Image,
  Modal,
} from "react-bootstrap";
import { db, storageRef } from "../firebase";
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//import image
import Nav from "./Nav";
import img1 from "./image/add.jpg";

//import style.css

import ProductFormCSS from "./style/product_form.module.css";
import "./style/Button_style.css";
import classNames from "classnames";

function Add_Products() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [attribute, setAttribute] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [productType, setProductType] = useState("");
  const [productTypeList, setProductTypeList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  // Event Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setImageUpload(file);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const createProduct = await addDoc(collection(db, "products"), {
      name,
      description,
      quantity: parseInt(quantity),
      price: parseInt(price),
      type,
      img: fileName,
      attribute: attribute,
      salses: 0,
    });

    if (imageUpload) {
      const imageRef = ref(storageRef, `products/${imageUpload.name}`);
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(snapshot.ref);
      setImageList((prev) => [...prev, url]);
    }
    alert("เพิ่มผลิตภัณฑ์สำเร็จ");

    setLoading(false);
    clearFormFields();
  };

  const clearFormFields = () => {
    setName("");
    setDescription("");
    setQuantity("");
    setPrice("");
    setSelectedFile(null);
    setFileName("");
    setType("");
    setAttribute("");
    setFileName("");
    setType("");
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    clearFormFields();
  };

  const handleAddSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const createProduct = await addDoc(collection(db, "type"), {
      productType,
    });
    alert("เพิ่มประเภทสินค้าสำเร็จ");

    setLoading(false);
    handleCloseAddModal();
  };

  useEffect(() => {
    fetchType();
  }, []);

  const fetchType = async () => {
    try {
      const q = query(collection(db, "type"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProductTypeList(newData);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  return (
    <>
      <Nav />
      <Modal centered show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มประเภทสินค้า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            <div className={ProductFormCSS.contact_field_modal}>
              {/* form product type */}
              <Form.Group>
                <Form.Control
                  type="text"
                  className={ProductFormCSS.input_small}
                  placeholder="ประเภทสินค้า"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  required
                  pattern="[ก-๏]+"
                />
              </Form.Group>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="success"
              className={ProductFormCSS.contact_form_submit}
            >
              {isLoading ? "Loading…" : "เพิ่มประเภท"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Container>
        <Row>
          <Col md={10} className={ProductFormCSS.sizecon}>
            <div className={ProductFormCSS.contact_inner}>
              <Row>
                <Col md={7}>
                  <div>
                    {" "}
                    {/* className="contact_form_inner" */}
                    <div className={ProductFormCSS.contact_field}>
                      <h3>เพิ่มผลิตภัณฑ์</h3>
                      <div className="d-grid gap-2">
                        <Button
                          variant="outline-primary"
                          size="lg"
                          className="custom-button hvr-reveal"
                          onClick={handleShowAddModal}
                        >
                          &#43;เพิ่มประเภทสินค้า
                        </Button>
                      </div>
                      <p>ทำการเพิ่มรายละเอียดของสินค้า</p>

                      <Form
                        className={ProductFormCSS.res_po}
                        onSubmit={handleSubmit}
                      >
                        {/* form product name */}
                        <Form.Group>
                          <Form.Label>ชื่อสินค้า</Form.Label>
                          <Form.Control
                            type="text"
                            className={classNames(
                              ProductFormCSS.input_small,
                              ProductFormCSS.form_control
                            )}
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            pattern="[a-zA-Zก-๏]+"
                          />
                        </Form.Group>

                        {/* form description */}
                        <Form.Group>
                          <Form.Label>คำอธิบาย</Form.Label>
                          <Form.Control
                            type="text"
                            className={classNames(
                              ProductFormCSS.input_small,
                              ProductFormCSS.form_control
                            )}
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                        </Form.Group>

                        {/* form amount */}
                        <Form.Group>
                          <Form.Label>จำนวน</Form.Label>
                          <Form.Control
                            className={classNames(
                              ProductFormCSS.input_small,
                              ProductFormCSS.form_control
                            )}
                            placeholder="Quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                          />
                        </Form.Group>

                        {/* form price */}
                        <Form.Group>
                          <Form.Label>ราคา</Form.Label>
                          <Form.Control
                            className={classNames(
                              ProductFormCSS.input_small,
                              ProductFormCSS.form_control
                            )}
                            placeholder="Price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                          />
                        </Form.Group>

                        {/* form product type */}
                        <Form.Group controlId="exampleForm.SelectCustom">
                          <Form.Label>ประเภทสินค้า</Form.Label>
                          <Form.Control
                            as="select"
                            className={classNames(
                              ProductFormCSS.input_small,
                              ProductFormCSS.form_control
                            )}
                            placeholder="Type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                          >
                            <option value={"ไม่มีประเภท"}>
                              กรุณาเลือกประเภท
                            </option>
                            {productTypeList.map((typeObj, index) => (
                              <option key={index} value={typeObj.productType}>
                                {typeObj.productType}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>

                        {/* form image */}
                        <Form.Group>
                          <Form.Label>รูปภาพสินค้า</Form.Label>
                          <Form.Control
                            className={classNames(
                              ProductFormCSS.input_small,
                              ProductFormCSS.form_control
                            )}
                            type="file"
                            onChange={handleFileChange}
                            required
                          />
                        </Form.Group>

                        {/* form attribute */}
                        <Form.Group>
                          <Form.Label>คุณลักษณะ</Form.Label>
                          <Form.Control
                            className={classNames(
                              ProductFormCSS.input_small,
                              ProductFormCSS.form_control
                            )}
                            placeholder="Attribute"
                            as="textarea"
                            value={attribute}
                            onChange={(e) => setAttribute(e.target.value)}
                            required
                            style={{
                              height: "150px",
                            }}
                          />
                        </Form.Group>

                        <Button
                          variant="success"
                          className={ProductFormCSS.contact_form_submit}
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading…" : "เพิ่มผลิตภัณฑ์"}
                        </Button>
                      </Form>
                    </div>
                  </div>
                </Col>

                <Col md={3}>
                  <Image
                    src={img1}
                    alt="Image 1"
                    className={ProductFormCSS.resize5}
                  />
                </Col>
                <Col md={2}>
                  <div
                    className={classNames(
                      ProductFormCSS.right_conatct_social_icon,
                      "d-flex",
                      "align-items-end"
                    )}
                  ></div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default Add_Products;
