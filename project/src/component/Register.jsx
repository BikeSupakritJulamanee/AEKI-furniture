import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Alert, Button, Image } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext'; //useContext
import { db } from '../firebase'; //database
import { collection, addDoc } from 'firebase/firestore'; //firestore

import { Container, Row, Col } from "react-bootstrap";

import "./style/Login.css";
import img5 from "./image/img5.jpg";
import img6 from "./image/img6.jpg"
import img7 from "./image/img7.jpg"
import img8 from "./image/img8.jpg"
function Register() {

  const [error, setError] = useState('');
  const { signUp } = useUserAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [product_id, setproduct_id] = useState([]);
  const [qrtproduct_id, setqrtproduct_id] = useState([]);
  const [isLoading, setLoading] = useState(false);

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    setError('');

    if (!email || !password || !username || !phone_number) {
      setError('Please fill in all required fields.');
      setLoading(false)
      return;
    }

    const cart_user = await addDoc(collection(db, 'cart'), {
      product_id: product_id,
      email: email,
      qauntityPerProductID: qrtproduct_id,
    });

    try {
      const userDocRef_Users = await addDoc(collection(db, 'user'), {
        email: email,
        username: username,
        phone_number: phone_number,
      });

      await signUp(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false)
    }
  };

  return (
    <Container>
      <br />
      <br />
      <Row>
        <Col> <Row>
          <Col className="size" md={5}>
            <Row>
              <Col md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <div className="aspect-ratio-box">
                  <Image src={img5} alt="Image 1" className="resize" />
                </div>
              </Col>
              <Col md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <div className="aspect-ratio-box">
                  <Image src={img6} alt="Image 2" className="resize" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <div className="aspect-ratio-box">
                  <Image src={img7} alt="Image 3" className="resize" />
                </div>
              </Col>
              <Col md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
                <div className="aspect-ratio-box">
                  <Image src={img8} alt="Image 4" className="resize" />
                </div>
              </Col>
            </Row>
          </Col>
        </Row></Col>
        <Col>
          <Row>
            <Col className="block_2">
              <br />
              <h2 className="mb-3">สมัครสมาชิก</h2>
              <h6 className="mb-3">
                เข้าสู่ระบบหรือสมัครสมาชิก IKEA Family
                วันนี้เพื่อพบกับประสบการณ์ที่เป็นส่วนตัวยิ่งขึ้น
              </h6>

              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  className="mb-3"
                  controlId="formBasicEmail"
                >
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-small "
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-small "
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-small "
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="formBasicPassword"
                >
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-small "
                  />
                </Form.Group>

                <div className="d-grid gap-2 justify-content-center">
                  <Button variant="warning" className="custom-button-style" type="submit" disabled={isLoading}  >
                    {isLoading ? 'Loading…' : 'SignUp'}
                  </Button>
                </div>
              </Form>

              <div className="p-4 box mt-3 text-center">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </Col>
          </Row>
        </Col>

      </Row >
    </Container >
  );
}

export default Register;