import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useUserAuth } from "../context/UserAuthContext";
import { Container, Button, Badge, Navbar } from "react-bootstrap";

import menuImage from '../image/menu.png';
import cart_icon from './image/shopping-cart.png'
import history_icon from './image/file.png'
import logout_icon from './image/logout.png'

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
    }

    return (
        <>

            <header>&#10166;บริการผ่อนชำระ 0%   &#10166;จัดส่งเริ่มต้นที่ 99 บาท   &#10166;นโยบายเปลี่ยนคืนสินค้าใน 365 วัน</header>
            <Container>
                <img className='menu' src={menuImage} alt="Menu" onClick={handleShow} />
                <Badge bg="primary" ><b>{user.email}</b></Badge>
                <a href="/userorderlist"><img className='menu' src={cart_icon} /></a>
                <a href="/order_history"><img className='menu' src={history_icon} /></a>
                <a href=''><img className='menu' src={logout_icon} onClick={handleLogout} /></a>
            </Container>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Navbar.Brand href="/home"> <div className='Brand' >หน้าหลัก</div></Navbar.Brand>
                    <Navbar.Brand href="/userorderlist"> <div className='Brand' >สินค้าในตะกร้า</div></Navbar.Brand>
                    <Navbar.Brand href='/order_history' > <div className='Brand' >ประวัติการสั่งซื้อ</div></Navbar.Brand>
                </Offcanvas.Body>
            </Offcanvas>

        </>
    );
}

export default Nav_Bar;