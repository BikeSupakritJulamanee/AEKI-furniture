import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { Container, Table, Form, Button, Modal } from "react-bootstrap";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";

import { format } from "date-fns";
import classNames from "classnames";
import ProductListCSS2 from "./style/Product_List.module.css";

function Order_List() {
  const [shipping, setShipping] = useState([]);
  const [select, setSelect] = useState("รอดำเนินการจัดส่ง");
  const [lock, setLock] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (select == "จัดส่งสำเร็จ") {
      setLock(true);
    } else {
      setLock(false);
    }
    fetchState();
  }, [select, show]);

  const handleEditSubmit = async (id) => {
    const companyDocRef = doc(db, "shipping", id);
    await updateDoc(companyDocRef, {
      status: "จัดส่งสำเร็จ",
    });
    handleShow();
  };

  const fetchState = async () => {
    try {
      const q = query(
        collection(db, "shipping"),
        where("status", "==", select)
      );
      const querySnapshot = await getDocs(q);
      const orderRefs = querySnapshot.docs.map((docSnap) =>
        doc(db, "order", docSnap.data().orderID)
      );
      const orderDocs = await Promise.all(
        orderRefs.map((orderRef) => getDoc(orderRef))
      );
      const newData = querySnapshot.docs.map((docSnap, index) => {
        const stateData = {
          id: docSnap.id,
          ...docSnap.data(),
        };
        if (orderDocs[index].exists()) {
          const orderData = {
            id: orderDocs[index].id,
            ...orderDocs[index].data(),
          };
          stateData.order = orderData;
        }
        return stateData;
      });
      setShipping(newData);
    } catch (error) {
      console.error("Error fetching state data:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, "dd/MM/yyyy HH:mm:ss");
  };

  let arr;

  return (
    <>
      <Nav />
      <Container>
        <br />
        <center>
          <h1>รายการสั่งซื้อ</h1>
        </center>

        <Form.Group>
          <Form.Select
            className="dropdown-small select_productType"
            placeholder="Type"
            onChange={(e) => setSelect(e.target.value)}
          >
            <option value="รอดำเนินการจัดส่ง">รอดำเนินการจัดส่ง</option>
            <option value="จัดส่งสำเร็จ">จัดส่งสำเร็จ</option>
          </Form.Select>
        </Form.Group>

        <br />
        <br />
        <Table hover responsive={"sm"}>
          <thead>
            <tr>
              <th>รหัสคำสั่งซื้อ</th>
              <th>ผู้สั่งซื้อ</th>
              <th>ยอดต้องชำระ (บาท)</th>
              <th>เวลา</th>
              <th className={ProductListCSS2.sticky_right3}>เปลี่ยนสถานะ</th>
              <th className={ProductListCSS2.sticky_right4}>#</th>
            </tr>
          </thead>
          <tbody>
            {shipping.map((s, index) => (
              <tr key={index}>
                <td>
                  <b>{s.order.id}</b>
                </td>
                <td>{s.order.email}</td>
                <td>{s.order.amount}</td>
                <td>{formatTimestamp(s.order.Date?.seconds * 1000)}</td>
                <td className={ProductListCSS2.sticky_right3}>
                  <Button
                    className={classNames(ProductListCSS2.bt, "btn--primary")}
                    variant="success"
                    style={{ width: "110px" }}
                    disabled={lock}
                    onClick={() => handleEditSubmit(s.id)}
                  >
                    ทำการจัดส่ง
                  </Button>
                </td>
                <td className={ProductListCSS2.sticky_right4}>
                  <Link
                    className={classNames(ProductListCSS2.bt, "btn--primary")}
                    style={{ textAlign: "center", paddingTop: "3px" }}
                    to={`/view_order?orderID=${encodeURIComponent(
                      s.order.id
                    )}&email=${encodeURIComponent(
                      s.order.email
                    )}&recipientAddyID=${encodeURIComponent(
                      s.recipientAddyID
                    )}&amount=${encodeURIComponent(
                      s.order.amount
                    )}&transportationID=${encodeURIComponent(
                      s.transportationID
                    )}&productID=${encodeURIComponent(
                      s.order.product_id
                    )}&quantityPerProductID=${encodeURIComponent(
                      (arr = Object.keys(s.order.quantityPerProductID).map(
                        (key) => s.order.quantityPerProductID[key]
                      ))
                    )}`}
                    target="_blank"
                    key={index}
                  >
                    view
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={show} centered onHide={handleClose}>
        <Modal.Header style={{ textAlign: "center" }} closeButton>
          <Modal.Title>ดำเนินการสำเร็จ</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "100px", textAlign: "center" }}>
          &#10004;
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Order_List;
