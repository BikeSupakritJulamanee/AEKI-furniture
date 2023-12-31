import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button, Image } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext"; //useContext
import { db } from "../firebase"; //database
import { collection, addDoc } from "firebase/firestore"; //firestore
import { Container, Row, Col } from "react-bootstrap";
import RegisterCSS from "./style/Register.module.css";
import img5 from "./image/img5.jpg";
import img6 from "./image/img6.jpg";
import img7 from "./image/img7.jpg";
import img8 from "./image/img8.jpg";
import classNames from "classnames";

function Register() {
  const [error, setError] = useState("");
  const { signUp } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [product_id, setproduct_id] = useState([]);
  const [point, setpoint] = useState(0);
  const [qrtproduct_id, setqrtproduct_id] = useState([]);
  const [isLoading, setLoading] = useState(false);

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");

    if (!email || !password || !username || !phone_number) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const cart_user = await addDoc(collection(db, "cart"), {
      product_id: product_id,
      email: email,
      qauntityPerProductID: qrtproduct_id,
    });

    try {
      const userDocRef_Users = await addDoc(collection(db, "user"), {
        email: email,
        username: username,
        phone_number: phone_number,
        member_point: point,
      });

      await signUp(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container>
      <br />
      <br />
      <Row>
        <Col className={RegisterCSS.posi} md={6}>
          <Row>
            <Col className={RegisterCSS.block_2}>
              <br />
              <h2 className="mb-3">สมัครสมาชิก</h2>
              <h6 className="mb-3">
                เข้าสู่ระบบหรือสมัครสมาชิก IKEA Family
                วันนี้เพื่อพบกับประสบการณ์ที่เป็นส่วนตัวยิ่งขึ้น
              </h6>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* form email */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    className={classNames(
                      RegisterCSS.input_small,
                      RegisterCSS.form_control
                    )}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className={classNames(
                      RegisterCSS.input_small,
                      RegisterCSS.form_control
                    )}
                    pattern="[a-zA-Z0-9ก-๏]+"
                  />
                </Form.Group>

                {/* form phone */}
                <Form.Group controlId="phoneNumberInput" className="mb-3">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone number"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={classNames(
                      RegisterCSS.input_small,
                      RegisterCSS.form_control
                    )}
                    pattern="^0{1}(6|8|9)[0-9]{8}"
                  />
                </Form.Group>

                {/* form password */}
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className={classNames(
                      RegisterCSS.input_small,
                      RegisterCSS.form_control
                    )}
                  />
                </Form.Group>

                <div className="d-grid gap-2 justify-content-center">
                  <Button
                    variant="warning"
                    className={RegisterCSS.custom_button_style}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading…" : "SignUp"}
                  </Button>
                </div>
              </Form>

              <div className="p-4 box mt-3 text-center">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </Col>
          </Row>
        </Col>

        <Col md={6}>
          <Row style={{ margin: "60px" }} className={RegisterCSS.image_resize}>
            <Col className={RegisterCSS.size} md={5}>
              <Row>
                <Col md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <div className={RegisterCSS.aspect_ratio_box}>
                    <Image
                      src={img5}
                      alt="Image 1"
                      className={RegisterCSS.resize}
                    />
                  </div>
                </Col>
                <Col md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <div className={RegisterCSS.aspect_ratio_box}>
                    <Image
                      src={img6}
                      alt="Image 2"
                      className={RegisterCSS.resize}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <div className={RegisterCSS.aspect_ratio_box}>
                    <Image
                      src={img7}
                      alt="Image 3"
                      className={RegisterCSS.resize}
                    />
                  </div>
                </Col>
                <Col md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <div className={RegisterCSS.aspect_ratio_box}>
                    <Image
                      src={img8}
                      alt="Image 4"
                      className={RegisterCSS.resize}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
export default Register;
