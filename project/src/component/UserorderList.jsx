import React, { useState, useEffect } from 'react';
import Nav_Bar from "../component/Nav_Bar";
import { Container, Table, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { db } from '../firebase';
import { useUserAuth } from "../context/UserAuthContext";
import {
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

function UserorderList() {
  const [orderUser, setOrderUser] = useState([]);
  const [userproductid, setuserproductid] = useState([]);
  const [price, setprice] = useState(0);
  const { user } = useUserAuth();
  const [matchingProducts, setMatchingProducts] = useState([]);

  useEffect(() => {
    fetchCart();
    fetchproduct();
    fetchprice();
  }, [user, orderUser]);

  const fetchprice = () => {
    let sum = 0;
    matchingProducts.map((e) => {
      sum = sum + (e.price * e.quantity)
      setprice(sum)
    })
  }

  const fetchproduct = async () => {
    if (user.email) {
      const q = query(
        collection(db, "products")
      );

      try {
        const querySnapshot = await getDocs(q);
        const newDataproducts = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));


        if (newDataproducts.length > 0) {
          const matching = [];
          
          if (orderUser.length > 0) {
            orderUser[0].product_id.forEach((cartProductId) => {
              const productMatch = newDataproducts.find((product) => product.id === cartProductId);
              if (productMatch) {
                matching.push({
                  ...productMatch,
                  cartProductId,
                });
              }
            });
          }
          setMatchingProducts(matching);


        }
      } catch (error) {
        console.error("Error fetching products data:", error);
      }
    }
  };


  const fetchCart = async () => {
    if (user.email) {
      const q = query(
        collection(db, "cart"),
        where("email", "==", user.email)
      );

      try {
        const querySnapshot = await getDocs(q);
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));


        setOrderUser(newData);

        if (newData.length > 0) {
          setuserproductid(newData[0].product_id);
        } else {

          setuserproductid([]);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
  };

  return (
    <div>
      <Nav_Bar />
      <Container>
      <div style={{ textAlign: 'right' }}><Link to="/home">เลือกสินค้าต่อ</Link></div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {matchingProducts.map((price, index) => (
                  <div key={index}>{price.name}</div>
                ))}
              </td>
              <td>
                {matchingProducts.map((price, index) => (
                  <div key={index}>{price.quantity}</div>
                ))}
              </td>
              <td>
                {matchingProducts.map((price, index) => (
                  <div key={index}>{price.price * price.quantity}</div>
                ))}
              </td>
            </tr>
          </tbody>
        </Table>
        <hr />
        <div style={{ textAlign: 'right' }}>Total Price: {price}</div>
      </Container>
    </div>
  );
}

export default UserorderList;
