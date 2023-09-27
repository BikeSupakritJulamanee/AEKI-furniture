import React, { useState, useEffect } from "react";
import { Container, Card, Image, Button, Form, Row, Col } from "react-bootstrap";
import Nav from "./Nav";
import { Link } from "react-router-dom";
import { storageRef, db } from "../firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";
import "./style/AdminHomePage.css";

function Home() {
  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storageRef, "products/");

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    listAll(imageListRef)
      .then((response) =>
        Promise.all(response.items.map((item) => getDownloadURL(item)))
      )
      .then((urls) => setImageList(urls))
      .catch((error) => console.error("Error listing images:", error));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const q = query(
        collection(db, "products"),
        where("name", ">=", searchTerm),
        orderBy("name")
      );

      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProducts(newData);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  return (
    <>
      <Nav />
      <Container>
        <Form.Group className="search_group">
          <Form.Control
            className="search_bar"
            type="text"
            placeholder="ค้นหาสิ่งที่คุณกำลังสนใจ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button className="search_btn" onClick={fetchProducts}>
            ค้นหา
          </Button>
        </Form.Group>
        <hr />

        <Row>
          {products.map((product, index) => (
            <Col key={index} md={3} className="mb-4">
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
                )}
                  `} target="_blank"
              >
                <Card className="card">
                  <Image
                    className="img"
                    src={imageList.find((url) => url.includes(product.img))}
                    style={{ width: "290px", height: "300px" }}
                  />
                  <Card.Body>
                    <div className="product_name">{product.name}</div>
                    <div className="product_description">
                      {product.description}
                    </div>
                    <div>
                      <span className="product_price">
                        {product.price.toLocaleString()}
                      </span>
                      <b className="bath"> บาท</b>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Home;