import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button, Image } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import img1 from "./image/img1.jpg";
import img2 from "./image/img2.jpg";
import img3 from "./image/img3.jpg";
import img4 from "./image/img4.jpg";
import LoginCSS from "./style/Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useUserAuth();
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate(
        email === "admin@gmail.com" && password === "admin789"
          ? "/adminhomepage"
          : "/home"
      );
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container className={LoginCSS.flex_container}>
      <br />
      <br />

      <Row>
        <Col className={LoginCSS.posi2} md={6}>
          <Row>
            <Col className={LoginCSS.block}>
              <br />

              <h2 className="mb-3">เข้าสู่ระบบ</h2>
              <h6 className="mb-3">
                เข้าสู่ระบบหรือสมัครสมาชิก IKEA Family
                วันนี้เพื่อพบกับประสบการณ์ที่เป็นส่วนตัวยิ่งขึ้น
              </h6>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={LoginCSS.input_small}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={LoginCSS.input_small}
                  />
                </Form.Group>

                <div className="d-grid gap-2 justify-content-center">
                  <Button
                    variant="warning"
                    className={LoginCSS.custom_button_style}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading…" : "Sign in"}
                  </Button>
                </div>
              </Form>

              <div className="p-4 box mt-3 text-center">
                Don't have an account?
                <Link to="/register">Sign up</Link>
              </div>
            </Col>
          </Row>
        </Col>

        <Col className={LoginCSS.posi} md={6}>
          <Row style={{ margin: "60px" }} className={LoginCSS.image_resize}>
            <Col className={LoginCSS.size} sm={5} md={5}>
              <Row>
                <Col sm={6} md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <div className={LoginCSS.aspect_ratio_box}>
                    <Image src={img1} alt="Image 1" />
                  </div>
                </Col>
                <Col sm={6} md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <div className={LoginCSS.aspect_ratio_box}>
                    <Image src={img2} alt="Image 2" />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col sm={6} md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <div className={LoginCSS.aspect_ratio_box}>
                    <Image
                      src={img3}
                      alt="Image 3"
                      className={LoginCSS.resize}
                    />
                  </div>
                </Col>
                <Col sm={6} md={6} style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <div className={LoginCSS.aspect_ratio_box}>
                    <Image
                      src={img4}
                      alt="Image 4"
                      className={LoginCSS.resize}
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

export default Login;
