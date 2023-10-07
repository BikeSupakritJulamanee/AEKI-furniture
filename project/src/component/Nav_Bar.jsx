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
            <header>บุญมี</header>
            <Container>
                <img className='menu' src={menuImage} alt="Menu" onClick={handleShow} />

                <Offcanvas show={show} onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Navbar.Brand href="/home"> <div className='Brand' >หน้าหลัก</div></Navbar.Brand>
                        <Navbar.Brand href="/userorderlist"> <div className='Brand' >สินค้าในตะกร้า</div></Navbar.Brand>
                        <Navbar.Brand href='/order_history' > <div className='Brand' >ประวัติการสั่งซื้อ</div></Navbar.Brand>
                        <Button onClick={handleLogout} variant='danger'>Logout</Button>
                    </Offcanvas.Body>
                </Offcanvas>
            </Container>
        </>
    );
}

export default Nav;