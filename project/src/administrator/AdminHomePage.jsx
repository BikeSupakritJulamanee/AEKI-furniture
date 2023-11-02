import React, { useState, useEffect } from "react";
import { Container, Card, Image, Form, Row, Col, Badge } from "react-bootstrap";
import Nav from "./Nav";
import { Link } from "react-router-dom";
import { storageRef, db } from "../firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";
import classnames from 'classnames';
import AdminHomePageCSS from "./style/AdminHomePage.module.css"

// Image imports
import user_icon from "./image/group.png";
import order_icon from "./image/order-history.png";
import transport_icon from "./image/delivery-truck.png";
import success_icon from "./image/check.png";
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
  }, [select, searchTerm]);

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
          <center><h4><Badge bg="info">Dash Board</Badge></h4></center>
          <div className={AdminHomePageCSS.con}>
            <div className={classnames(AdminHomePageCSS.item, 'board')} data-order="1">
              <Card className={AdminHomePageCSS.card_po} >
                <Row>
                  <Col md={8} sm={6} xs={6}>
                    <Card.Body>
                      <Card.Subtitle className={classnames(AdminHomePageCSS.text_muted, 'mb-2')} >
                        New Users
                      </Card.Subtitle>
                      <Card.Text>
                        <Badge bg="success">{user.length} user</Badge>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                  <Col md={4} sm={6} xs={6} className="res">
                    <Image
                      className={AdminHomePageCSS.img}
                      src={user_icon}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
            <div className={classnames(AdminHomePageCSS.item, 'board')} data-order="2">
              <Card className={AdminHomePageCSS.card_po}>
                <Row>
                  <Col md={8} sm={6} xs={6}>
                    <Card.Body>
                      <Card.Subtitle className={classnames(AdminHomePageCSS.text_muted, 'mb-2')}>
                        Orders
                      </Card.Subtitle>
                      <Card.Text>
                        <Badge bg="success">{shipping_1.length} order</Badge>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                  <Col md={4} sm={6} xs={6} className="res">
                    <Image
                      className={AdminHomePageCSS.img}
                      src={order_icon}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
            <div className={classnames(AdminHomePageCSS.item, 'board')} data-order="3">
              <Card className={AdminHomePageCSS.card_po}>
                <Row>
                  <Col md={8} sm={6} xs={6}>
                    <Card.Body>
                      <Card.Subtitle className={classnames(AdminHomePageCSS.text_muted, 'mb-2')}>
                        Success
                      </Card.Subtitle>
                      <Card.Text>
                        <Badge bg="success">{shipping_2.length} order</Badge>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                  <Col md={4} sm={6} xs={6} className="res">
                    <Image
                      className={AdminHomePageCSS.img}
                      src={success_icon}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </Col>
                </Row>
              </Card>
            </div>

            <div className={classnames(AdminHomePageCSS.item, 'board')} data-order="4">
              <Card className={AdminHomePageCSS.card_po}>
                <Row>
                  <Col md={8} sm={6} xs={6}>
                    <Card.Body>
                      <Card.Subtitle className={classnames(AdminHomePageCSS.text_muted, 'mb-2')}>
                        <p className="size_font">Transportation</p>
                      </Card.Subtitle>
                      <Card.Text>
                        <Badge bg="success">{transport.length} company</Badge>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                  <Col md={4} sm={6} xs={6} className="res">
                    <Image
                      className={AdminHomePageCSS.img}
                      src={transport_icon}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </Col>
                </Row>
              </Card>
            </div>

            <div className={classnames(AdminHomePageCSS.item, 'board')} data-order="5">
              <Card className={AdminHomePageCSS.card_po}>
                <Row>
                  <Col md={8} sm={6} xs={6}>
                    <Card.Body>
                      <Card.Subtitle className={classnames(AdminHomePageCSS.text_muted, 'mb-2')} >
                        Product
                      </Card.Subtitle>
                      <Card.Text>
                        <Badge bg="success">{products.length} piece</Badge>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                  <Col md={4} sm={6} xs={6} className="res">
                    <Image
                      className={AdminHomePageCSS.img}
                      src={product_icon}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
          </div>
        </Container>
        <center>
          <Form.Group>
            <Form.Control
              className={AdminHomePageCSS.search_bar}
              type="text"
              placeholder="ค้นหาด้วยชื่อสินค้า"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </center>

        <Form.Group>
          <Form.Select
            className={classnames(AdminHomePageCSS.dropdown_small, AdminHomePageCSS.select_productType)}
            placeholder="Type"
            onChange={(e) => setSelect(e.target.value)}
            required
          >
            <option value={""}>ค้นหาด้วยประเภทสินค้า</option>
            {productTypeList.map((typeObj, index) => (
              <option key={index} value={typeObj.productType}>
                👉🏼
                {typeObj.productType}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Container>
          <div className={AdminHomePageCSS.card_container}>
            <Row className="box">
              {products.map((product, index) => (
                <div key={index} className={AdminHomePageCSS.card_wrapper}>
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
                    <Card className={AdminHomePageCSS.card_container} >
                      <div className={AdminHomePageCSS.card_background}>
                        <Image
                          className={AdminHomePageCSS.img}
                          src={imageList.find((url) =>
                            url.includes(product.img)
                          )}
                          style={{ width: "290px", height: "300px" }}
                        />
                      </div>

                      <Card.Body className={AdminHomePageCSS.card_body} >
                        <div className={AdminHomePageCSS.product_name}>{product.name}</div>
                        <div>
                          <spanc className={AdminHomePageCSS.product_price}>
                            {product.price.toLocaleString()}
                          </spanc>
                          <b className={AdminHomePageCSS.bath}> บาท</b>
                        </div>

                        <div className={AdminHomePageCSS.product_description}>
                          {product.description}
                        </div>
                      </Card.Body>

                    </Card>
                  </Link>
                </div>
              ))}
              <hr className={AdminHomePageCSS.hr_text} data-content="IKEA"></hr>
            </Row>
          </div>
        </Container>
      </Container>
    </>
  );
}
export default Home;