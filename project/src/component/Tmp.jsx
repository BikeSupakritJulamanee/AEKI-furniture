import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { getDocs, collection, query } from "firebase/firestore";
import { db } from "../firebase";


function Tmp() {

  const [transportList, setTransportList] = useState([])
  const [transportID, setTransportID] = useState([])

  useEffect(() => {
    fetch_transportation()
  }, []);

  // read transport
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

  return (
    <>
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
      bukayo saka
    </>
  )
}

export default Tmp; 