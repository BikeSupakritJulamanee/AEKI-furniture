import { useUserAuth } from "../context/UserAuthContext";
import React, { useState, useEffect } from 'react';
import Nav_Bar from "../component/Nav_Bar";
import { Container, Table, Button, Modal, Form, Image } from 'react-bootstrap';
import { Link } from "react-router-dom";

//firebase
import { db, storageRef } from '../firebase';
import { ref, getDownloadURL, listAll } from "firebase/storage";
import {
  getDocs, collection, query, where, doc, updateDoc, addDoc, getDoc, serverTimestamp  // Add this import for getDoc
} from "firebase/firestore";


function UserorderList() {
  const { user } = useUserAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [orderUser, setOrderUser] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [phone, setphone] = useState('');
  const [price, setprice] = useState(0);
  const [transportCompanyName, setTransportCompanyName] = useState('');
  const [recipname, setrecipname] = useState('');
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [transportList, setTransportList] = useState([])
  const [transportID, setTransportID] = useState("")
  const [address_user, setaddress_user] = useState([]);
  const [f_user, setf_user] = useState([]);
  const [selectAddress, setselectAddress] = useState("")
  const handleShowAddModal = () => setShowAddModal(true);
  const imageListRef = ref(storageRef, "products/");
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    listAll(imageListRef)
      .then((response) =>
        Promise.all(response.items.map((item) => getDownloadURL(item)))
      )
      .then((urls) => setImageList(urls))
      .catch((error) => console.error("Error listing images:", error));
  }, []);

  const fetchData = async () => {
    await fetch_transportation();
    await fetchAdress();
    await fetchUser();
    await fetchCart();
    fetchprice();
  };

  useEffect(() => {
    fetchproduct()
    fetchprice()
  }, [orderUser, matchingProducts])

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const createProduct = await addDoc(collection(db, 'recipientAddy'), {
      destination: transportCompanyName,
      email: user.email,
      phoneNumber: phone,
      recipientName: recipname
    });
    alert('เพิ่มประเภทสินค้าสำเร็จ');

  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    clearFormFields();
  };

  const fetchprice = async () => {
    let sum = 0;
    matchingProducts.forEach((price) => {
      orderUser.forEach((even) => {
        sum += price.price * even.qauntityPerProductID[price.id];
      });
    });
    setprice(sum);
  };

  const fetchproduct = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const newDataproducts = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    if (newDataproducts.length > 0 && orderUser.length > 0) {
      const matching = orderUser[0].product_id
        .filter((cartProductId) => newDataproducts.some((product) => product.id === cartProductId))
        .map((cartProductId) => {
          const productMatch = newDataproducts.find((product) => product.id === cartProductId);
          return {
            ...productMatch,
            cartProductId,
          };
        });
      setMatchingProducts(matching);
    }
  };

  const fetchCart = async () => {
    if (user && user.email) {
      const q = query(collection(db, "cart"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(newData)
      setOrderUser(newData);
    }
  };

  const fetchUser = async () => {
    if (user && user.email) {
      const q = query(collection(db, "user"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id, }));
      setf_user(newData);
    };
  }

  const fetchAdress = async () => {
    if (user && user.email) {
      const q = query(collection(db, "recipientAddy"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id, }));
      setaddress_user(newData);
    };
  }

  const fetch_transportation = async () => {
    const q = query(collection(db, 'transportation'));
    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setTransportList(newData);
  };

  const handlePay = async (e) => {
    try {
      const user_uid = f_user[0].id
      const cartDocRef = doc(db, "user", user_uid);
      const updatedQrt = parseInt(f_user[0].member_point) + price
      console.log(updatedQrt)
      await updateDoc(cartDocRef, {
        member_point: updatedQrt
      });

      matchingProducts.forEach(async (product) => {
        const productId = product.id;
        const purchasedQuantity = orderUser[0].qauntityPerProductID[productId];

        const newQuantity = product.quantity - purchasedQuantity;
        const newSalsesQuantity = product.salses + purchasedQuantity;

        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, { quantity: newQuantity });
        await updateDoc(productRef, { salses: newSalsesQuantity });
      });

      console.log("Product quantities updated successfully.");
    } catch (error) {
      console.error("Error updating product quantities:", error);
    }
    const order_user = await addDoc(collection(db, 'order'), {
      product_id: orderUser[0].product_id,
      quantityPerProductID: orderUser[0].qauntityPerProductID,
      email: user.email,
      amount: price,
      Date: serverTimestamp(),
    });

    const orderId = order_user.id;

    const shipping_user = await addDoc(collection(db, 'shipping'), {
      orderID: orderId,
      email: user.email,
      transportationID: transportID,
      recipientAddyID: selectAddress,
      status: "รอดำเนินการจัดส่ง"
    });

    if (orderUser[0].id) {

      const docRef = doc(db, 'cart', orderUser[0].id); // Assuming 'cart' is your collection name
      try {
        await updateDoc(docRef, {
          product_id: [],
          qauntityPerProductID: {}
        });
        console.log('Document updated successfully.');
      } catch (error) {
        console.error('Error updating document:', error);
      }
    } else {
      console.error('orderUser.id is undefined or null.');
    }
  }

  const handleDelete = async (productId, userId) => {
    try {
      const cartDocRef = doc(db, "cart", userId);
      const cartDocSnapshot = await getDoc(cartDocRef);
      const currentCartData = cartDocSnapshot.data();
      const updatedMatchingProducts = matchingProducts.filter((product) => product.id !== productId);
      setMatchingProducts(updatedMatchingProducts);
      if (typeof currentCartData.qauntityPerProductID === 'object') {
        const updatedProductIds = currentCartData.product_id.filter((id) => id !== productId);

        await updateDoc(cartDocRef, { product_id: updatedProductIds });


        if (currentCartData.qauntityPerProductID.hasOwnProperty(productId)) {
          const updatedQrt = { ...currentCartData.qauntityPerProductID };
          delete updatedQrt[productId];
          await updateDoc(cartDocRef, { qauntityPerProductID: updatedQrt });
          fetchproduct();
          fetchCart();
          fetchprice();
          console.log(matchingProducts)
          console.log("Product removed from cart successfully!");

        } else {
          console.error("Product not found in cart.");
        }
      } else {
        console.error("Invalid 'qauntityPerProductID' field in cart document.");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  return (
    <>
      <Nav_Bar />
      <Container>

        <div style={{ textAlign: 'right' }}><Link to="/home"><Button>เลือกสินค้าต่อ</Button></Link></div>

        <Table hover>
          <thead>
            <tr>
              <th>ผลิตภัณฑ์</th>
              <th>จำนวน</th>
              <th>ราคา</th>
              <th>-</th>
            </tr>
          </thead>
          <tbody>
            {matchingProducts.map((price, index) => (
              <tr key={index}>
                <td>{price.name}
                  <Image
                    className="img"
                    src={imageList.find((url) =>
                      url.includes(price.img)
                    )}
                    style={{ width: "100px", height: "100px" }}
                  />

                </td>
                <td>{orderUser[0]?.qauntityPerProductID[price.id] || 0}</td>
                <td>{price.price * (orderUser[0]?.qauntityPerProductID[price.id] || 0)}</td>
                <td><Button onClick={() => handleDelete(price.id, orderUser[0].id)} style={{ fontSize: "12px", padding: "1px", marginBottom: "3px" }} variant="danger">DELETE</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div style={{ textAlign: 'right', marginBottom: "10px", fontWeight: "bold" }}>ที่อยู่ในการจัดส่ง</div>
        <Form>
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
                {typeObj.recipientName}
                {typeObj.phoneNumber}
                {typeObj.destination}
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

          <div>
            <div style={{ textAlign: 'right', padding: "20px" }}>ยอดรวม: {price} บาท</div>
            <div style={{ float: 'right' }}><Button type="submit" onSubmit={handlePay}>ยืนยันการซื้อ</Button></div>
          </div>
        </Form>

      </Container>

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
    </>
  );
}
export default UserorderList;