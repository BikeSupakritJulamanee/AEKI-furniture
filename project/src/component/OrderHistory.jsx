import React, { useState, useEffect } from "react";
import Nav_Bar from "../component/Nav_Bar";
import { Container, Table, Button } from "react-bootstrap";
import { db } from "../firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { format } from "date-fns";
import Footer from "./Footer";

function OrderHistory() {
  const [user_order, setuser_order] = useState([]);
  const [user_cart, setuser_cart] = useState([]);
  const [user_ship, setuser_ship] = useState([]);
  const [MatchingProducts, setMatchingProducts] = useState([]);
  const { user } = useUserAuth();

  // Define pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Change this value to set the number of items per page

  useEffect(() => {
    fetchOrder();
    fetchProduct();
    fetchCart();
    fetchshipping();
    console.log(1);
  }, [user_cart, user]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, "dd/MM/yyyy HH:mm:ss");
  };

  const fetchOrder = async () => {
    try {
      const q = query(
        collection(db, "order"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setuser_order(newData);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const fetchshipping = async () => {
    try {
      const orderIds = user_order.map((order) => order.id);
      const q = query(
        collection(db, "shipping"),
        where("orderID", "in", orderIds)
      );
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setuser_ship(newData);
    } catch (error) {
      console.error("Error fetching shipping data:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const q = query(collection(db, "cart"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      if (newData.length !== user_cart.length) {
        setuser_cart(newData);
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  const fetchProduct = async () => {
    if (user.email) {
      const q = query(collection(db, "products"));
      try {
        const querySnapshot = await getDocs(q);
        const newDataproducts = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        if (newDataproducts.length > 0) {
          const matching = [];

          if (user_cart.length > 0) {
            user_order.forEach((order) => {
              order.product_id.forEach((cartProductId) => {
                const productMatch = newDataproducts.find(
                  (product) => product.id === cartProductId
                );
                if (productMatch) {
                  matching.push({
                    orderId: order.id,
                    productName: productMatch.name,
                    productQuantity: order.quantityPerProductID[cartProductId],
                  });
                }
              });
            });
          }
          setMatchingProducts(matching);
          console.log(MatchingProducts);
        }
      } catch (error) {
        console.error("Error fetching products data:", error);
      }
    }
  };

  // Function to change the current page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = user_order.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <Nav_Bar />
      <Container>
        <Table hover responsive="sm">
          <thead>
            <tr>
              <th>หมายเลขการสั่งซื้อ</th>
              <th>ผลิตภัณฑ์</th>
              <th>จำนวน</th>
              <th>ราคา</th>
              <th>วัน เวลา</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {MatchingProducts.map(
                    (productInfo) =>
                      productInfo.orderId === order.id && (
                        <div key={productInfo.productName}>
                          {productInfo.productName}
                        </div>
                      )
                  )}
                </td>
                <td>
                  {MatchingProducts.map(
                    (productInfo) =>
                      productInfo.orderId === order.id && (
                        <div key={productInfo.productQuantity}>
                          {productInfo.productQuantity}
                        </div>
                      )
                  )}
                </td>
                <td>{order.amount}</td>
                <td>{formatTimestamp(order.Date?.seconds * 1000)}</td>
                <td>{user_ship[index]?.status || "กรุณารอสักครู่"}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination component */}
        <ul className="pagination">
          {Array(Math.ceil(user_order.length / itemsPerPage))
            .fill()
            .map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
        </ul>
        
        <center>
          <Link to="/home">
            <Button
              className="hvr_grow"
              style={{ width: "160px", paddingRight: "20px" }}
            >
              กลับหน้าเเรก
            </Button>
          </Link>
        </center>
      </Container>

      <div style={{marginBottom:'8rem'}} ></div>
      <Footer/>
    </div>
  );
}
export default OrderHistory;