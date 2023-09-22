import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext"; //useContext
import { db } from "../firebase"; //database
import { collection, addDoc } from "firebase/firestore"; //firestore

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Register() {
  const [error, setError] = useState("");
  const { signUp } = useUserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone_number, setPhoneNumber] = useState("");

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !username || !phone_number) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      // const userDocRef_Users = await addDoc(collection(db, 'User'), {
      //   email,
      //   username,
      //   phone_number,
      // });

      // const userDocRef_Accounts = await addDoc(collection(db, 'Account'), {
      //   email,
      //   posts: 0,
      //   followers: 0,
      //   following: 0,
      //   bio: 'Write your description...',
      //   image_profile: 'default_user_profile.png',
      // });

      // console.log('Document written with ID:', userDocRef_Users.id);

      await signUp(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container>
      <br />
      <br />
      <Row>
        <Col></Col>
        <Col>
          <Row>
            <Col>
              <br />
              <center>
                <h2 className="mb-3">Register</h2>
              </center>

              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  className="mb-3 d-flex justify-content-center"
                  controlId="formBasicEmail"
                >
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-small "
                  />
                </Form.Group>

                <Form.Group className="mb-3 d-flex justify-content-center">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-small "
                  />
                </Form.Group>

                <Form.Group className="mb-3 d-flex justify-content-center">
                  <Form.Control
                    type="text"
                    placeholder="Phone number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-small "
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3 d-flex justify-content-center"
                  controlId="formBasicPassword"
                >
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-small "
                  />
                </Form.Group>

                <div className="d-grid gap-2 justify-content-center">
                  <Button className="custom-button-style" type="submit">
                    SignUp
                  </Button>
                </div>
              </Form>

              <div className="p-4 box mt-3 text-center">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </Col>
          </Row>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default Register;
