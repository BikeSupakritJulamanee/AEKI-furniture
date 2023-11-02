import { useUserAuth } from "../context/UserAuthContext";
import React, { useState, useEffect } from "react";
import Nav_Bar from "../component/Nav_Bar";
import { Container, Table, Button, Modal, Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

//firebase
import { db, storageRef } from "../firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { getDocs, collection, query, where, doc, updateDoc, addDoc, getDoc, serverTimestamp, } from "firebase/firestore";


import UserorderListCSS from "./style/UserorderList.module.css"


//image
import shopping_cart from "./image/shopping-cart.png";
import confirmation from "./image/confirmation.png";

function UserorderList() {
  const { user } = useUserAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [orderUser, setOrderUser] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [phone, setphone] = useState("");
  const [price, setprice] = useState(0);
  const [transportCompanyName, setTransportCompanyName] = useState("");
  const [recipname, setrecipname] = useState("");
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [transportList, setTransportList] = useState([]);
  const [transportID, setTransportID] = useState("");
  const [address_user, setaddress_user] = useState([]);
  const [f_user, setf_user] = useState([]);
  const [selectAddress, setselectAddress] = useState("");
  const handleShowAddModal = () => setShowAddModal(true);
  const imageListRef = ref(storageRef, "products/");
  const [imageList, setImageList] = useState([]);
  const [buyStatus, setBuyStatus] = useState(false);

  const [transportCost, setTransportCost] = useState("");

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    const [id, cost] = selectedValue.split("|"); // Assuming values are joined with '|'

    setTransportID(id);
    setTransportCost(cost);
  };

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

  useEffect(() => {
    fetchproduct();
    fetchprice();
  }, [orderUser, matchingProducts]);

  const fetchData = async () => {
    await fetch_transportation();
    await fetchAdress();
    await fetchUser();
    await fetchCart();
    fetchprice();
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const createProduct = await addDoc(collection(db, "recipientAddy"), {
      destination: transportCompanyName,
      email: user.email,
      phoneNumber: phone,
      recipientName: recipname,
    });
    alert("เพิ่มที่อยู่สำเร็จ");
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    clearFormFields();
  };

  const fetchprice = async () => {
    const sum = matchingProducts.reduce((total, price) => {
      return (
        total +
        orderUser.reduce((subtotal, even) => {
          return subtotal + price.price * even.qauntityPerProductID[price.id];
        }, 0)
      );
    }, 0);

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
        .filter((cartProductId) =>
          newDataproducts.some((product) => product.id === cartProductId)
        )
        .map((cartProductId) => ({
          ...newDataproducts.find((product) => product.id === cartProductId),
          cartProductId,
        }));

      if (matching.length !== matchingProducts.length) {
        setMatchingProducts(matching);
      }
    }
  };

  const fetchCart = async () => {
    try {
      if (!user || !user.email) return;
      const q = query(collection(db, "cart"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setOrderUser(newData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    if (!user || !user.email) return;
    const q = query(collection(db, "user"), where("email", "==", user.email));
    try {
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setf_user(newData);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchAdress = async () => {
    if (!user || !user.email) return;
    const q = query(
      collection(db, "recipientAddy"),
      where("email", "==", user.email)
    );
    try {
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setaddress_user(newData);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const fetch_transportation = async () => {
    const q = query(collection(db, "transportation"));

    try {
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTransportList(newData);
    } catch (error) {
      console.error("Error fetching transportation:", error);
    }
  };

  const changByStatus = () => {
    setBuyStatus(false);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (matchingProducts.length == 0) {
      alert("ไม่มีรายการสินค้า");
      return;
    }

    try {
      const user_uid = f_user[0].id;
      const cartDocRef = doc(db, "user", user_uid);
      const updatedQrt = parseInt(f_user[0].member_point) + price;
      console.log(updatedQrt);
      await updateDoc(cartDocRef, {
        member_point: updatedQrt,
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

    const order_user = await addDoc(collection(db, "order"), {
      product_id: orderUser[0].product_id,
      quantityPerProductID: orderUser[0].qauntityPerProductID,
      email: user.email,
      amount: price + parseInt(transportCost),
      Date: serverTimestamp(),
    });

    const orderId = order_user.id;

    const shipping_user = await addDoc(collection(db, "shipping"), {
      orderID: orderId,
      email: user.email,
      transportationID: transportID,
      recipientAddyID: selectAddress,
      status: "รอดำเนินการจัดส่ง",
    });

    if (orderUser[0].id) {
      const docRef = doc(db, "cart", orderUser[0].id); // Assuming 'cart' is your collection name
      try {
        await updateDoc(docRef, {
          product_id: [],
          qauntityPerProductID: {},
        });
        console.log("Document updated successfully.");
        fetchCart();
        setBuyStatus(true);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    } else {
      console.error("orderUser.id is undefined or null.");
    }
  };

  const handleDelete = async (productId, userId) => {
    try {
      const cartDocRef = doc(db, "cart", userId);
      const cartDocSnapshot = await getDoc(cartDocRef);
      const currentCartData = cartDocSnapshot.data();
      const updatedMatchingProducts = matchingProducts.filter(
        (product) => product.id !== productId
      );
      setMatchingProducts(updatedMatchingProducts);
      if (typeof currentCartData.qauntityPerProductID === "object") {
        const updatedProductIds = currentCartData.product_id.filter(
          (id) => id !== productId
        );

        await updateDoc(cartDocRef, { product_id: updatedProductIds });

        if (currentCartData.qauntityPerProductID.hasOwnProperty(productId)) {
          const updatedQrt = { ...currentCartData.qauntityPerProductID };
          delete updatedQrt[productId];
          await updateDoc(cartDocRef, { qauntityPerProductID: updatedQrt });
          fetchCart();
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
        <div style={{ textAlign: "right" }}>
          <Link to="/home">
            <Button
              className={UserorderListCSS.hvr_grow}
              style={{ width: "160px", paddingRight: "20px" }}
            >
              เลือกสินค้าต่อ
              <img
                className={UserorderListCSS.hvr_icon}
                src={shopping_cart}
                style={{ marginBottom: "3px" }}
              />
            </Button>
          </Link>
        </div>

        {/* order table */}
        <Table hover responsive>
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
                <td>
                  <Image
                    src={imageList.find((url) => url.includes(price.img))}
                    style={{ width: "100px", height: "100px" }}
                  />
                  <div>{price.name}</div>
                </td>
                <td style={{ paddingTop: "49px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {orderUser[0]?.qauntityPerProductID[price.id] || 0}
                  </div>
                </td>
                <td style={{ paddingTop: "49px" }}>
                  {price.price *
                    (orderUser[0]?.qauntityPerProductID[price.id] || 0)}
                </td>
                <td style={{ paddingTop: "49px" }}>
                  <Button
                    onClick={() => handleDelete(price.id, orderUser[0].id)}
                    style={{
                      fontSize: "13px",
                      borderRadius: "40px",
                      height: "35px",
                    }}
                    variant="danger"
                    className="custom-button hvr-reveal"
                  >
                    DELETE
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div
          style={{
            textAlign: "right",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          ที่อยู่ในการจัดส่ง
        </div>
        <Form onSubmit={(e) => handlePay(e)}>
          {/* select address */}
          <Form.Control
            as="select"
            placeholder="Type"
            style={{ width: "224px", marginBottom: "10px" }}
            onChange={(e) => setselectAddress(e.target.value)}
            required
          >
            <option value={""}>เลือกที่อยู่</option>
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
              placeholder="Type"
              style={{ width: "225.333334px", marginBottom: "10px" }}
              onChange={handleSelectChange}
              required
            >
              <option value="">เลือกขนส่ง</option>
              {transportList.map((typeObj, index) => (
                <option
                  key={index}
                  value={`${typeObj.id}|${typeObj.shippingCost}`}
                >
                  {typeObj.transportCompanyName} / ราคา: {typeObj.shippingCost}{" "}
                  บาท
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Button
            variant="outline-primary"
            className="custom-button hvr-reveal"
            style={{ marginLeft: "20px" }}
            onClick={handleShowAddModal}
          >
            &#43;เพิ่มช่องทางการขนส่ง
          </Button>

          <div>
            <div style={{ textAlign: "right", padding: "20px" }}>
              ยอดรวม: {transportCost ? price + parseInt(transportCost) : price}{" "}
              บาท
            </div>
            <div style={{ float: "right" }}>
              <Button
                type="submit"
                className={UserorderListCSS.hvr_grow}
                style={{ width: "160px", paddingRight: "20px" }}
              >
                ยืนยันการซื้อ
                <img
                  className={UserorderListCSS.hvr_icon}
                  src={confirmation}
                  style={{ marginBottom: "3px" }}
                />
              </Button>
            </div>
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
              <div className={UserorderListCSS.contact_field_modal}>
                <Form.Control
                  type="text"
                  placeholder="ที่อยู่"
                  className="input-small"
                  value={transportCompanyName}
                  onChange={(e) => setTransportCompanyName(e.target.value)}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group>
              <div className={UserorderListCSS.contact_field_modal}>
                <Form.Control
                  type="text"
                  placeholder="เบอร์โทร"
                  className="input-small"
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                  required
                  pattern="^0{1}[6-9]{1}[0-9]{8}"
                />
              </div>
            </Form.Group>

            <Form.Group>
              <div className={UserorderListCSS.contact_field_modal}>
                <Form.Control
                  type="text"
                  placeholder="ชื่อผู้รับ"
                  className="input-small"
                  value={recipname}
                  onChange={(e) => setrecipname(e.target.value)}
                  required
                  pattern="[a-zA-Zก-๙]+"
                />
              </div>
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className={UserorderListCSS.contact_form_submit}
              disabled={isLoading}
            >
              {isLoading ? "Loading…" : "เพิ่มช่องทางการขนส่ง"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={buyStatus} centered onHide={changByStatus}>
        <Modal.Header style={{ textAlign: "center" }} closeButton>
          <Modal.Title>คำสั่งซื้อสำเร็จ</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ fontSize: "300px", textAlign: "center", color: "green" }}
        >
          <div className={UserorderListCSS.swing_in_top_fwd}>&#10004;</div>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default UserorderList;