import React, { useState, useEffect } from "react";
import { Container, Card, Image, Button, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { storageRef, db } from "../firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import Nav_Bar from "../component/Nav_Bar";
import Footer from "./Footer";
import HomeCSS from "./style/Home.module.css";
import classNames from "classnames";

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

  function Dom_search_form_1() {
    document.getElementById('searchForm')
    .style.backgroundColor = 'white';
  }

  function Dom_search_form_2() {
    document.getElementById('searchForm')
    .style.backgroundColor = 'lightgrey';
  }

  return (
    <>
      <Nav_Bar />
      <Container>
        <div className={HomeCSS.avs}>
          <center>
            <b className={HomeCSS.animation_text}>สินค้าขายดี</b>
          </center>
          <Row>
            {topProductList.map((product, index) => (
              <div key={index} className={HomeCSS.card_wrapper}>
                <Link style={{ textDecoration: 'none' }}
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
                  <div className={HomeCSS.card_container}>
                    {/* show top product */}
                    <Row className="box">
                      <Card
                        className={HomeCSS.avs} style={{ height: "280px" }}
                        onMouseEnter={(e) => {
                          entTarget.stye.currle.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0)';
                        }}
                      >
                        <center>
                          <Image
                            src={imageList.find((url) =>
                              url.includes(product.img)
                            )}
                            style={{ width: "200px", height: "200px" }}
                          />

                          <Card.Body>
                            <div className={HomeCSS.product_name}>
                              {product.name}
                            </div>
                          </Card.Body>
                        </center>
                      </Card>
                    </Row>
                  </div>
                </Link>
              </div>
            ))}
          </Row>
        </div>

        <center>
          {/* search */}
          <Form.Group>
            <Form.Control id="searchForm"
              className={HomeCSS.search_bar}
              type="text"
              placeholder="คุณกำลังมองหาอะไรอยู่"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              onKeyUp={() => { Dom_search_form_1() }}
              onKeyDown={() => { Dom_search_form_2() }}
            />
          </Form.Group>
        </center>

        {/* select */}
        <Form.Group>
          <Form.Select
            className={classNames(
              HomeCSS.dropdown_small,
              HomeCSS.select_productType
            )}
            placeholder="Type"
            onChange={(e) => setSelect(e.target.value)}
            required
          >
            <option value={""}>ค้นหาด้วยประเภทสินค้า</option>
            {productTypeList.map((typeObj, index) => (
              <option key={index} value={typeObj.productType}>
                <span className="option-icon">👉🏼</span>
                {typeObj.productType}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className={HomeCSS.card_container}>
          <Row className="box">
            {products.map((product, index) => (
              <div key={index} className={HomeCSS.card_wrapper}>
                <Link style={{ textDecoration: 'none' }}
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
                >
                  {/* show all product */}
                  <Card
                    className={HomeCSS.card_content}
                    style={{ height: "530px" }}
                  >
                    <div className={HomeCSS.card_background}>
                      <center>
                        <Image
                          src={imageList.find((url) =>
                            url.includes(product.img)
                          )}
                          style={{ width: "16rem", height: "16rem" }}
                        />
                      </center>
                    </div>
                    <Card.Body className={HomeCSS.card_body}>
                      <div className={HomeCSS.product_name}>{product.name}</div>
                      <div className={HomeCSS.product_description}>
                        {product.description}
                      </div>
                      <div>
                        <span className={HomeCSS.product_price}>
                          {product.price.toLocaleString()}
                        </span>
                        <b className={HomeCSS.bath}> บาท</b>
                        <span style={{ marginLeft: "2rem" }}>
                          คงเหลือ: {product.quantity} ชิ้น
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
                <div>
                  <div className={HomeCSS.button_back}>
                    <Button
                      variant="warning"
                      className={HomeCSS.contact_form}
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
      <hr className={HomeCSS.hr_text} data-content="IKEA"></hr>
      <Footer />
    </>
  );
}
export default Home;