import React, { useState, useEffect } from 'react';
import Nav_Bar from "../component/Nav_Bar";
import { Container, Table, Button,Modal,Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { db } from '../firebase';
import { useUserAuth } from "../context/UserAuthContext";
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

function UserorderList() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [orderUser, setOrderUser] = useState([]);
  const [userproductid, setuserproductid] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState('');
  const [price, setprice] = useState(0);
  const [transportCompanyName, setTransportCompanyName] = useState('');
  const { user } = useUserAuth();
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [address, setaddress] = useState("");
  const handleShowAddModal = () => setShowAddModal(true);

  useEffect(() => {
    fetchCart();
    fetchproduct();
    fetchprice();
    fetchAdress();
  }, [user, orderUser]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const cartID = address[0].destination;
    const cartDocRef = doc(db, "recipientAddy", cartID);
    const cartDocSnapshot = await getDoc(cartDocRef);
    const currentCartData = cartDocSnapshot.data();
      const updatedQrt = {
        ...currentCartData
      };
      await updateDoc(cartDocRef, { destination: updatedQrt,email:address[0].email,phoneNumber:address[0].phoneNumber,recipientName:address[0].recipientName});
    handleCloseAddModal();
};

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    clearFormFields();
};

  const fetchprice = () => {
    let sum = 0;
    matchingProducts.map((price, index) => (
      orderUser.map((even, index) => (
          sum = sum+(price.price*even.qauntityPerProductID[price.id])
          
        ))
        ))
        setprice(sum)
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

  const fetchAdress = async () => {
    if (user.email) {
      const q = query(
        collection(db, "recipientAddy"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setaddress(newData);
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
              orderUser.map((even, index) => (
                  <div key={index}>{even.qauntityPerProductID[price.id]}</div>
                ))
                ))}
              </td>
              <td>
              {matchingProducts.map((price, index) => (
              orderUser.map((even, index) => (
                  <div key={index}>{price.price*even.qauntityPerProductID[price.id]}</div>
                ))
                ))}
              </td>
            </tr>
          </tbody>
        </Table>
        <hr />
        <div style={{ textAlign: 'right', marginBottom:"10px",fontWeight:"bold"}}>ที่อยู่ในการจัดส่ง</div> 
        {address.map((even)=>(
          <div style={{ textAlign: 'right'}}>{even.destination}
          <div style={{ textAlign: 'right'}}><span style={{ fontWeight:"bold"}}>อีเมลล์:</span> {even.email}</div>
          <div style={{ textAlign: 'right'}}><span style={{ fontWeight:"bold"}}>เบอร์โทร:</span> {even.phoneNumber}</div>
          <div style={{ textAlign: 'right'}}><span style={{ fontWeight:"bold"}}>ชื่อผู้ชื่อ:</span> {even.recipientName}</div>
          </div>
        ))}
        <Button variant="dark" onClick={handleShowAddModal}>
                    &#43;เพิ่มช่องทางการขนส่ง
        </Button>
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>เพิ่มช่องทางการขนส่ง</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleAddSubmit}>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    placeholder="ที่อยู่"
                                    value={transportCompanyName}
                                    onChange={(e) => setTransportCompanyName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    type="number"
                                    placeholder="เบอร์โทร"
                                    value={shippingCost}
                                    onChange={(e) => setShippingCost(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    type="number"
                                    placeholder="ชื่อผู้รับ"
                                    value={shippingCost}
                                    onChange={(e) => setShippingCost(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="success" type="submit" disabled={isLoading}>
                                {isLoading ? 'Loading…' : 'เพิ่มช่องทางการขนส่ง'}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
       <hr />
        <div style={{ textAlign: 'right', padding:"20px"}}>Total Price: {price} บาท</div>
      </Container>
    </div>
  );
}

export default UserorderList;
