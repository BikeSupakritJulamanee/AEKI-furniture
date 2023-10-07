import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useUserAuth } from "../context/UserAuthContext";
import { Navbar } from 'react-bootstrap';
import menuImage from '../image/menu.png';  // Import the image
import { Container, Card, Image, Button, Form, Row, Col } from "react-bootstrap";

function Nav() {

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
    }

    return (
        <>
            <header>admin section&#9822;</header>
            <Container>
                <img className='menu' src={menuImage} alt="Menu" onClick={handleShow} />

                <Offcanvas show={show} onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Navbar.Brand href="/adminhomepage"> <div className='Brand' >ผลิตภัณฑ์ของคุณ</div></Navbar.Brand>
                        <Navbar.Brand href="/add_products"> <div className='Brand' >เพิ่มผลิตภัณฑ์</div></Navbar.Brand>
                        <Navbar.Brand href='/product_list' > <div className='Brand' >รายการสินค้าทั้งหมด</div></Navbar.Brand>
                        <Navbar.Brand href='/order_list' > <div className='Brand' >รายการสั่งซื้อ</div></Navbar.Brand>
                        <Navbar.Brand href='/transportation' >  <div className='Brand' >บริษัทขนส่ง</div></Navbar.Brand>
                        <Button onClick={handleLogout} variant='danger'>Logout</Button>
                    </Offcanvas.Body>
                </Offcanvas>
            </Container>
        </>
    );
}

export default Nav;