import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Image,
  Button,
  Form,
  Row,
  Col,
  ProgressBar,
  Badge,
} from "react-bootstrap";
import Nav from "./Nav";
import { Link } from "react-router-dom";
import { storageRef, db } from "../firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";
import "./style/AdminHomePage.css";

// Image imports
import user_icon from "./image/group.png";
import order_icon from "./image/order-history.png";
import transport_icon from "./image/delivery-truck.png";
import success_icon from "./image/check.png";
import graph_icon from "./image/growth.png";
import product_icon from "./image/double-bed.png";

function Home() {
  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storageRef, "products/");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [select, setSelect] = useState("");
  const [shipping_1, setShipping_1] = useState([]);
  const [shipping_2, setShipping_2] = useState([]);
  const [transport, setTransport] = useState([]);
  const [user, setUser] = useState([]);
  const [productTypeList, setProductTypeList] = useState([]);

  useEffect(() => {
    listAll(imageListRef)
      .then((response) =>
        Promise.all(response.items.map((item) => getDownloadURL(item)))
      )
      .then((urls) => setImageList(urls))
      .catch((error) => console.error("Error listing images:", error));
    fetchShipping_1();
    fetchShipping_2();
    fetchTransport();
    fetchUser();
    fetchType();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [select]);

  const fetchShipping_1 = async () => {
    try {
      const q = query(
        collection(db, "shipping"),
        where("status", "==", "รอดำเนินการจัดส่ง")
      );
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setShipping_1(newData);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const fetchShipping_2 = async () => {
    try {
      const q = query(
        collection(db, "shipping"),
        where("status", "==", "จัดส่งสำเร็จ")
      );
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setShipping_2(newData);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const fetchTransport = async () => {
    try {
      const q = query(collection(db, "transportation"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTransport(newData);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const q = query(collection(db, "user"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUser(newData);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const fetchType = async () => {
    try {
      const q = query(collection(db, "type"), orderBy("productType"));
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

  const fetchProducts = async () => {
    try {
      let q = collection(db, "products");

      if (select !== "") {
        q = query(q, where("type", "==", select));
      }

      if (searchTerm !== "") {
        q = query(q, where("name", ">=", searchTerm), orderBy("name"));
      }

      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProducts(newData);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  return (
    <>
      <Nav />
      <Container>
        <Container>
          <div class="con">
            <div class="item board" data-order="1">
              <Card className="card-po">
                <Row>
                  <Col md={8} sm={6} xs={6}>
                    <Card.Body>
                      <Card.Subtitle className="mb-2 text-muted">
                        New Users
                      </Card.Subtitle>
                      <Card.Text>
                        <Badge bg="success">{user.length} user</Badge>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                  <Col md={4} sm={6} xs={6} className="res">
                    <Image
                      className="img"
                      src={user_icon}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
            <div className="item board" data-order="2">
              <Card className="card-po">
                <Row>
                  <Col md={8} sm={6} xs={6}>
                    <Card.Body>
                      <Card.Subtitle className="mb-2 text-muted">
                        Orders
                      </Card.Subtitle>
                      <Card.Text>
                        <Badge bg="success">{shipping_1.length} order</Badge>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                  <Col md={4} sm={6} xs={6} className="res">
                    <Image
                      className="img"
                      src={order_icon}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
            <div className="item board" data-order="3">
              <Card className="card-po ">
                <Row>
                  <Col md={8} sm={6} xs={6}>
                    <Card.Body>
                      <Card.Subtitle className="mb-2 text-muted">
                        Success
                      </Card.Subtitle>
                      <Card.Text>
                        <Badge bg="success">{shipping_2.length} order</Badge>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                  <Col md={4} sm={6} xs={6} className="res">
                    <Image
                      className="img"
                      src={success_icon}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
            <div className="item board" data-order="4">
              <Card className="card-po">
                <Row>
                  <Col md={8} sm={6} xs={6}>
                    <Card.Body>
                      <Card.Subtitle className="mb-2 text-muted">
                        <p className="size_font">Transportation</p>
                      </Card.Subtitle>
                      <Card.Text>
                        <Badge bg="success">{transport.length} company</Badge>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                  <Col md={4} sm={6} xs={6} className="res">
                    <Image
                      className="img"
                      src={transport_icon}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
            <div className="item board" data-order="5">
              <Card className="card-po">
                <Row>
                  <Col md={8} sm={6} xs={6}>
                    <Card.Body>
                      <Card.Subtitle className="mb-2 text-muted">
                        Product
                      </Card.Subtitle>
                      <Card.Text>
                        <Badge bg="success">{products.length} piece</Badge>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                  <Col md={4} sm={6} xs={6} className="res">
                    <Image
                      className="img"
                      src={product_icon}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
          </div>
        </Container>
        <hr />

        <Form.Group className="search_group">
          <Form.Control
            className="search_bar"
            type="text"
            placeholder="ค้นหาด้วยชื่อสินค้า"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button className="search_btn" onClick={fetchProducts}>
            ค้นหา
          </Button>
        </Form.Group>

        <Form.Group controlId="exampleForm.SelectCustom">
          <Form.Select
            as="select"
            className="dropdown-small"
            placeholder="Type"
            onChange={(e) => setSelect(e.target.value)}
            required
          >
            <option value={""}>ทุกประเภท</option>
            {productTypeList.map((typeObj, index) => (
              <option key={index} value={typeObj.productType}>
                <span className="option-icon">👉🏼</span>
                {typeObj.productType}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Container>
          <div className="card-container">
            <Row className="box">
              {products.map((product, index) => (
                <div key={index} className="card-wrapper">
                  <Link
                    to={`/edit_products?id=${encodeURIComponent(
                      product.id
                    )}&name=${encodeURIComponent(
                      product.name
                    )}&quantity=${encodeURIComponent(
                      product.quantity
                    )}&description=${encodeURIComponent(
                      product.description
                    )}&image=${encodeURIComponent(
                      product.img
                    )}&price=${encodeURIComponent(
                      product.price
                    )}&type=${encodeURIComponent(
                      product.type
                    )}&attribute=${encodeURIComponent(product.attribute)}
          `}
                    target="_blank"
                  >
                    <Card className="card_content">
                      <div class="card_background">
                        <Image
                          className="img"
                          src={imageList.find((url) =>
                            url.includes(product.img)
                          )}
                          style={{ width: "290px", height: "300px" }}
                        />
                      </div>

                      <Card.Body class="card_body">
                        <div className="product_name">{product.name}</div>

                        <div>
                          <span className="product_price">
                            {product.price.toLocaleString()}
                          </span>
                          <b className="bath"> บาท</b>
                        </div>

                        <div className="product_description">
                          {product.description}
                        </div>
                        {/* <div class="action_bottom_bar">
                          <Button className="bt2">rr</Button>
                        </div> */}
                      </Card.Body>
                    </Card>
                  </Link>
                </div>
              ))}
              <hr className="hr-text" data-content="IKEA"></hr>
            </Row>
          </div>
        </Container>
      </Container>
    </>
  );
}
export default Home;