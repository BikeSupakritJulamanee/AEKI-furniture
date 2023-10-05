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
  getDoc,
  addDoc // Add this import for getDoc
} from "firebase/firestore";

function UserorderList() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [orderUser, setOrderUser] = useState([]);
  const [userproductid, setuserproductid] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState('');
  const [phone, setphone] = useState('');
  const [price, setprice] = useState(0);
  const [transportCompanyName, setTransportCompanyName] = useState('');
  const [recipname, setrecipname] = useState('');
  const { user } = useUserAuth();
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [transportList, setTransportList] = useState([])
  const [transportID, setTransportID] = useState("")
  const [address_user, setaddress_user] = useState([]);
  const [selectAddress,setselectAddress] =useState("")
  const handleShowAddModal = () => setShowAddModal(true);
  const [orderID, setOrderID] = useState(null);

  useEffect(() => {
    fetchCart();
    fetchproduct();
    fetchprice();
    // fetchAdress();
  }, [user, orderUser]);

  useEffect(() => {
    // fetchCart();
    // fetchproduct();
    // fetchprice();
    fetch_transportation()
    fetchAdress();
  }, [user]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const createProduct = await addDoc(collection(db, 'recipientAddy'), {
      destination:transportCompanyName,
      email:user.email,
      phoneNumber:phone,
      recipientName:recipname
    });
    alert('เพิ่มประเภทสินค้าสำเร็จ');

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
      setaddress_user(newData);
    }
  };

  const fetch_transportation = async () => {
    try {
      const q = query(collection(db, 'transportation'));

      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setTransportList(newData);
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  const handlePay=async(e)=>{
      const order_user = await addDoc(collection(db, 'order'), {
        product_id:orderUser[0].product_id,
        quantityPerProductID:orderUser[0].qauntityPerProductID,
        email:user.email,
        amount:price
      });
      const orderId = order_user.id;

      const shipping_user = await addDoc(collection(db, 'shipping'), {
        orderID:orderId,
        email:user.email,
        transportationID:transportID,
        recipientAddyID:selectAddress,
        status:"รอดำเนินการจัดส่ง"
      });
      
    
      
    }

    // const createOrder = async (product_id, price) => {
    //   try {
    //     // Add the order document to Firestore
    //     const docRef = await db.collection('orders').add({
    //       product_id,
    //       price,
    //     });
    
    //     // Get the generated order ID
    //     const orderId = docRef.id;
    
    //     // Display the order ID
    //     console.log('Order ID:', orderId);
    //   } catch (error) {
    //     console.error('Error creating order:', error);
    //   }
    // };


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
        
        
        <Form.Control
          as="select"
          className="dropdown-small"
          placeholder="Type"
          onChange={(e) => setselectAddress(e.target.value)}
          required
        >
          <option value={''}>เลือกที่อยู่</option>
          {address_user.map((typeObj, index) => (
            <option key={index} value={typeObj.id}>
              {typeObj.destination}
              {typeObj.recipientName}
              {typeObj.email}
              {typeObj.phoneNumber}
            </option>
          ))}
        </Form.Control>
        

        <Form.Group controlId="exampleForm.SelectCustom">
        <Form.Control
          as="select"
          className="dropdown-small"
          placeholder="Type"
          onChange={(e) => setTransportID(e.target.value)}
          required
        >
          <option value={''}>เลือกขนส่ง</option>
          {transportList.map((typeObj, index) => (
            <option key={index} value={typeObj.id}>
              {typeObj.transportCompanyName} /ราคา: {typeObj.shippingCost} บาท
            </option>
          ))}
        </Form.Control>
      </Form.Group>
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
                                    type="text"
                                    placeholder="เบอร์โทร"
                                    value={phone}
                                    onChange={(e) => setphone(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    placeholder="ชื่อผู้รับ"
                                    value={recipname}
                                    onChange={(e) => setrecipname(e.target.value)}
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
        <div style={{ textAlign: 'right', padding:"20px"}}>Total Price: {price} Bath</div>
        <div style={{ float: 'right'}}><Button onClick={handlePay}>PAY</Button></div>
      </Container>
    </div>
  );
}

export default UserorderList;
