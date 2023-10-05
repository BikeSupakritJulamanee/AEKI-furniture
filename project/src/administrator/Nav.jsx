import { useState } from "react";
import { Container } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import "./style/Nav.css";
import { Navbar, Button } from "react-bootstrap";
import menuImage from "../image/menu.png"; // Import the image
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
      <Navbar className="admin_nav">
        <Container>
          <img
            className="menu"
            src={menuImage}
            alt="Menu"
            onClick={handleShow}
          />

          <Button onClick={handleLogout}>Logout</Button>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {" "}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Navbar.Brand href="/adminhomepage">
            {" "}
            <div className="Brand">ผลิตภัณฑ์ของคุณ</div>
          </Navbar.Brand>
          <Navbar.Brand href="/add_products">
            {" "}
            <div className="Brand">เพิ่มผลิตภัณฑ์</div>
          </Navbar.Brand>
          <Navbar.Brand href="/product_list">
            {" "}
            <div className="Brand">รายการสินค้าทั้งหมด</div>
          </Navbar.Brand>
          <Navbar.Brand href="/order_list">
            {" "}
            <div className="Brand">รายการสั่งซื้อ</div>
          </Navbar.Brand>
          <Navbar.Brand href="/transportation">
            {" "}
            <div className="Brand">บริษัทขนส่ง</div>
          </Navbar.Brand>
          <Navbar.Brand href="/out_of_stock">
            {" "}
            <div className="Brand">เเจ้งเตือนสินค้าหมด</div>
          </Navbar.Brand>
          <Navbar.Brand href="/member_list">
            {" "}
            <div className="Brand">ลูกค้าดีเด่น</div>
          </Navbar.Brand>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Nav;
