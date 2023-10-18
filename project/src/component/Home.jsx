import React, { useState, useEffect } from "react";
import { Container, Card, Image, Button, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { storageRef, db } from "../firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { getDocs, collection, query, where, orderBy, doc, updateDoc, getDoc } from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import Nav_Bar from "../component/Nav_Bar";
import Footer from "./Footer";
import "./style/Home.css";

function Home() {
  const { user } = useUserAuth();
  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storageRef, "products/");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [homecart, sethomecart] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [productTypeList, setProductTypeList] = useState([]);
  const [select, setSelect] = useState("");
  const [topProductList, setTopProductList] = useState([]);

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
  }, [searchTerm, select]);

  useEffect(() => {
    fetchCart();
    fetchType();
    fecthTopProducts();
  }, [user]);

  const fetchCart = async () => {
    if (user.email) {
      const q = query(collection(db, "cart"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      sethomecart(newData);
    }
  };

  const handlebuy = async (productId, qrt) => {
    setLoading(true);
    try {
      if (homecart.length === 0) {
        console.error("Cart not found.");
        return;
      }
      const cartID = homecart[0].id;
      const cartDocRef = doc(db, "cart", cartID);
      const cartDocSnapshot = await getDoc(cartDocRef);
      const currentCartData = cartDocSnapshot.data();
      if (typeof currentCartData.qauntityPerProductID === "object") {
        if (currentCartData.qauntityPerProductID.hasOwnProperty(productId)) {
          const updatedQrt = {
            ...currentCartData.qauntityPerProductID,
            [productId]:
              currentCartData.qauntityPerProductID[productId] + parseInt(qrt),
          };
          await updateDoc(cartDocRef, { qauntityPerProductID: updatedQrt });
          console.log("Product quantity updated in cart successfully!");
        } else {
          const updatedProductIds = [...currentCartData.product_id, productId];
          const updatedQrt = {
            ...currentCartData.qauntityPerProductID,
            [productId]: qrt,
          };
          await updateDoc(cartDocRef, {
            qauntityPerProductID: updatedQrt,
            product_id: updatedProductIds,
          });
          console.log("Product added to cart successfully!");
        }
      } else {
        console.error("Invalid 'qauntityPerProductID' field in cart document.");
      }
    } catch (error) {
      console.error("Error adding/updating product quantity in cart:", error);
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
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
    const filteredProducts = newData.filter((product) => product.quantity > 0);
    setProducts(filteredProducts);
  };

  const fecthTopProducts = async () => {
    if (user.email) {
      const q = query(collection(db, "products"), orderBy("salses", "desc"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const filteredProducts = newData.filter(
        (product) => product.quantity > 0
      );

      const data = filteredProducts.slice(0, 4);
      setTopProductList(data);
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

  return (
    <>
      <Nav_Bar />
      <Container>
        <center>
          <b className="animation_text">สินค้าขายดี</b>
        </center>

        <Row>
          {topProductList.map((product, index) => (
            <div key={index} className="card-wrapper">
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
                <div className="card-container">
                  {/* show top product */}
                  <Row className="box">
                    <Card style={{ height: "280px" }}>
                      <center>
                        <Image
                          className="img"
                          src={imageList.find((url) =>
                            url.includes(product.img)
                          )}
                          style={{ width: "200px", height: "200px" }}
                        />
                      </center>
                      <Card.Body>
                        <div className="product_name">{product.name}</div>
                      </Card.Body>
                    </Card>
                  </Row>
                </div>
              </Link>
            </div>
          ))}
        </Row>
        <center>
          {/* search */}
          <Form.Group className="search_group">
            <Form.Control
              className="search_bar"
              type="text"
              placeholder="คุณกำลังมองหาอะไรอยู่"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </center>

        {/* select */}
        <Form.Group>
          <Form.Select
            className="dropdown-small select_productType"
            placeholder="Type"
            onChange={(e) => setSelect(e.target.value)}
            required
          >
            <option value={""}>ค้นหาด้วยประเภทสินค้า;</option>
            {productTypeList.map((typeObj, index) => (
              <option key={index} value={typeObj.productType}>
                <span className="option-icon">👉🏼</span>
                {typeObj.productType}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="card-container">
          <Row className="box">
            {products.map((product, index) => (
              <div key={index} className="card-wrapper">
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
                  {/* show all product */}
                  <Card className="card_content" style={{ height: "570px" }}>
                    <div class="card_background">
                      <Image
                        className="img"
                        src={imageList.find((url) => url.includes(product.img))}
                        style={{ width: "290px", height: "300px" }}
                      />
                    </div>
                    <Card.Body className="card_body">
                      <div className="product_name">{product.name}</div>
                      <div className="product_description">
                        {product.description}
                      </div>
                      <div>
                        <span className="product_price">
                          {product.price.toLocaleString()}
                        </span>
                        <b className="bath"> บาท</b>
                        <span style={{ marginLeft: "2rem" }}>
                          คงเหลือ: {product.quantity} ชิ้น
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
                <div>
                  <div className="button_back">
                    <Button
                      variant="warning"
                      className="contact_form"
                      disabled={isLoading}
                      onClick={() => handlebuy(product.id, 1)}
                    >
                      ADD TO CART
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Row>
        </div>


      </Container>
      <hr className="hr-text" data-content="IKEA"></hr>
      <Footer />
    </>
  );
}
export default Home;