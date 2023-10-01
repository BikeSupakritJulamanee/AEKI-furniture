import React, { useState, useEffect } from "react";
import { Container, Card, Image, Button, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { storageRef, db } from "../firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import Nav_Bar from "../component/Nav_Bar";
function Home() {
  const { user, logOut } = useUserAuth(); // Include logOut from useUserAuth
  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storageRef, "products/");


  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectProduct, setselectProduct] = useState([]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  }

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

  const handlebuy = (e, product_id) => {
    e.preventDefault();
    const updatedSelectProduct = [...selectProduct];
    updatedSelectProduct.push(product_id)
    setselectProduct(updatedSelectProduct);
    console.log(updatedSelectProduct);
  };
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
    }
  };




  return (
    <>
      <Nav_Bar />
      <Container>
        {user.email}
        <Form.Group className="search_group">
          <Form.Control
            className="search_bar"
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button className="search_btn" onClick={fetchProducts}>
            search
          </Button>
        </Form.Group>
        <hr />

        <Row>
          {products.map((product, index) => (
            <Col key={index} md={3} className="mb-4">
              <Link
                to={`/product_detail?id=${encodeURIComponent(
                  product.id
                )}&name=${encodeURIComponent(
                  product.name
                )}&quantity=${encodeURIComponent(
                  product.quantity
                )}&description=${encodeURIComponent(
                  product.description
                )}&image=${encodeURIComponent(
                  product.img
                )}&price=${encodeURIComponent(product.price)}`}
                target="_blank"
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
                    <div>
                      <Button
                        type="submit"
                        className="contact_form_submit"
                        variant="success"
                        onClick={(e) => handlebuy(e, product.id)}
                      >
                        ADD TO CART
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}

export default Home;
