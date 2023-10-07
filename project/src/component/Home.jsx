import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Image,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { storageRef, db } from "../firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";
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
import { useUserAuth } from "../context/UserAuthContext";
import Nav_Bar from "../component/Nav_Bar";
import Footer from "./Footer";
import "./style/Home.css";
function Home() {
  const { user, logOut } = useUserAuth();
  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storageRef, "products/");

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [homecart, sethomecart] = useState([]);

  const [isLoading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      // Navigate logic here, but you need to import 'navigate' from your routing library.
    } catch (err) {
      console.log(err.message);
    }
  };

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
  }, [searchTerm]); // Include searchTerm in the dependency array.

  useEffect(() => {
    fetchCart();
  }, [user]); // Include user in the dependency array.

  const fetchCart = async () => {
    if (user.email) {
      const q = query(collection(db, "cart"), where("email", "==", user.email));

      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      sethomecart(newData);

      // You don't need to set cartID here.
    }
  };

  const handlebuy = async (productId, qrt) => {
    setLoading(true);
    try {
      if (homecart.length === 0) {
        console.error("Cart not found.");
        return;
      }

      // Assuming you want to work with the first cart found.
      const cartID = homecart[0].id;
      const cartDocRef = doc(db, "cart", cartID);

      // Get the current cart data
      const cartDocSnapshot = await getDoc(cartDocRef);
      const currentCartData = cartDocSnapshot.data();

      // Check if the 'qauntityPerProductID' field exists and is an object
      if (typeof currentCartData.qauntityPerProductID === "object") {
        // Check if productId already exists in 'qauntityPerProductID'
        if (currentCartData.qauntityPerProductID.hasOwnProperty(productId)) {
          // Update the quantity for the existing product
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
      const filteredProducts = newData.filter(
        (product) => product.quantity > 0
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <>
      <Nav_Bar />

      <Container>
        {user.email}

        <div style={{ textAlign: "right" }}>
          <Link to="/userorderlist">ดูสินค้าในตะกร้า</Link>
        </div>
        <div style={{ textAlign: "right" }}>
          <Link to="/order_history">ดูประวัติการซื้อ</Link>
        </div>

        <Form.Group className="search_group">
          <Form.Control
            className="search_bar"
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button className="search_btn" onClick={fetchProducts}>
            Search
          </Button>
        </Form.Group>
        <hr />
        <Container>
          <div className="card-container">
            <Row className="box">
              {products.map((product, index) => (
                // <Col key={index} md={3} className="mb-4">

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
                    <Card className="card_content" style={{ height: "550px" }}>
                      <div class="card_background">
                        <Image
                          className="img"
                          src={imageList.find((url) =>
                            url.includes(product.img)
                          )}
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
                          <span style={{ marginLeft: "4rem" }}>
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
              <hr className="hr-text" data-content="IKEA"></hr>
            </Row>
          </div>
        </Container>
      </Container>
      <Footer />
    </>
  );
}

export default Home;
