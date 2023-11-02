import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useUserAuth } from "../context/UserAuthContext";
import { Container, Badge, Navbar, Button, Col, Stack, Nav } from "react-bootstrap";

import menuImage from "../image/menu.png";
import cart_icon from "./image/shopping-cart.png";
import history_icon from "./image/file.png";
import AEKI from "./image/ikea-logo.png";

import NavBarCSS from "./style/Nav_Bar.module.css";

import classnames from 'classnames';

function Nav_Bar() {
  const { user } = useUserAuth();
  const { logOut } = useUserAuth();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      <header>
        &#10166;บริการผ่อนชำระ 0% &#10166;จัดส่งเริ่มต้นที่ 99 บาท
        &#10166;นโยบายเปลี่ยนคืนสินค้าใน 365 วัน
      </header>
      <Navbar className={NavBarCSS.admin_nav}>
        <Container>
          <img
            className={NavBarCSS.menu}
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

          <Col>
            <Nav className="justify-content-end flex-grow-1 pe-5">
              <a href="/userorderlist" className="respon1">
                <img className={NavBarCSS.menu} src={cart_icon} />
              </a>

              <a href="/order_history" className="respon2">
                <img className={NavBarCSS.menu} src={history_icon} />
              </a>
            </Nav>
          </Col>
          <Button
            onClick={handleLogout}
            style={{ marginBottom: "20px" }}
            className={classnames(NavBarCSS.logout_bt, NavBarCSS.respon3)}
          >
            Logout
          </Button>
        </Container>
      </Navbar>

      <div class={NavBarCSS.box_nav}></div>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Navbar.Brand href="/home">
            {" "}
            <div className={NavBarCSS.Brand}>หน้าหลัก</div>
          </Navbar.Brand>
          <Navbar.Brand href="/userorderlist">
            {" "}
            <div className={NavBarCSS.Brand}>สินค้าในตะกร้า</div>
          </Navbar.Brand>
          <Navbar.Brand href="/order_history">
            {" "}
            <div className={NavBarCSS.Brand}>ประวัติการสั่งซื้อ</div>
          </Navbar.Brand>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Nav_Bar;
