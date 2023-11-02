import { useState } from "react";
import { Container, Col, Navbar, Button, Badge, Stack } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import NavCSS from './style/Nav.module.css'
import menuImage from "../image/menu.png"; // Import the image
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AEKI from "./image/ikea-logo.png";
import classNames from "classnames";

function Nav() {
  const { logOut, user } = useUserAuth();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <Navbar className={NavCSS.admin_nav}>
        <Container>
          <img
            className={NavCSS.menu}
            src={menuImage}
            alt="Menu"
            onClick={handleShow}
          />

          <Col>
            <Stack direction="horizontal" gap={2}>
              <div className="p-4">
                <img src={AEKI} alt="Menu" onClick={handleShow} />
              </div>
              <div className="p-4">
                <Badge bg="primary">
                  <b>{user.email}</b>
                </Badge>
              </div>
            </Stack>
          </Col>
          <Button onClick={handleLogout} className={classNames(NavCSS.logout_bt, NavCSS.respon3)}>
            Logout
          </Button>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title> </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Navbar.Brand href="/adminhomepage">
            {" "}
            <div className={NavCSS.Brand}>ผลิตภัณฑ์ของคุณ</div>
          </Navbar.Brand>
          <Navbar.Brand href="/add_products">
            {" "}
            <div className={NavCSS.Brand}>เพิ่มผลิตภัณฑ์</div>
          </Navbar.Brand>
          <Navbar.Brand href="/product_list">
            {" "}
            <div className={NavCSS.Brand}>คลังสินค้า</div>
          </Navbar.Brand>
          <Navbar.Brand href="/order_list">
            {" "}
            <div className={NavCSS.Brand}>รายการสั่งซื้อ</div>
          </Navbar.Brand>
          <Navbar.Brand href="/transportation">
            {" "}
            <div className={NavCSS.Brand}>บริษัทขนส่ง</div>
          </Navbar.Brand>
          <Navbar.Brand href="/out_of_stock">
            {" "}
            <div className={NavCSS.Brand}>เเจ้งเตือนสินค้าหมด</div>
          </Navbar.Brand>
          <Navbar.Brand href="/member_list">
            {" "}
            <div className={NavCSS.Brand}>ลูกค้าดีเด่น</div>
          </Navbar.Brand>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
export default Nav;