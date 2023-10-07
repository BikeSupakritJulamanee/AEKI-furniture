import React from "react";

import "./style/Footer.css";

function Footer() {
  return (
    <>
      <div class="footer-line"></div>
      <div class="footer-wrapper">
        <section class="footer-top">
          <div class="footer-headline">
            <h2>Topics Details</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Assumenda, ab iusto modi quo, at vel suscipit distinctio impedit
              tempore non et adipisci molestiae quasi dolores rem repellat
              aliquam! Est, illo.
            </p>
          </div>
        </section>
        <div class="footer-columns">
          <section class="footer-logo">
            {/* <Image src="" alt=""> */}

            <h2 class="hide">IKEA</h2>
          </section>
          <section></section>
          <section></section>
          <section></section>
          <section>
            <h3>รายระเอียดหัวข้อ</h3>
            <ul>
              <li>
                <a href="#" title="Terms and services">
                  ผลิตภัณฑ์ของคุณ
                </a>
              </li>
              <li>
                <a href="#" title="Privacy Policy">
                  เพิ่มผลิตภัณฑ์
                </a>
              </li>
              <li>
                <a href="#" title="Cookies">
                  รายการสินค้าทั้งหมด
                </a>
              </li>
              <li>
                <a href="#" title="Licenses">
                  รายการสั่งซื้อ
                </a>
              </li>
              <li>
                <a href="#" title="Cookies">
                  บริษัทขนส่ง
                </a>
              </li>
            </ul>
          </section>
        </div>
        <div class="footer-bottom">
          <small>© My Company Ltd. 2023, All rights reserved</small>
          <span class="social-links">
            <a href="#" title="Link1">
              {/* <Image src=" " alt='LINK_ICON'> */}
            </a>
            <a href="#" title="Link1">
              {/* <Image src=" " alt='LINK_ICON'> */}
            </a>
            <a href="#" title="Link1">
              {/* <Image src=" " alt='LINK_ICON'> */}
            </a>
            <a href="#" title="Link1">
              {/* <Image src=" " alt='LINK_ICON'> */}
            </a>
            <a href="#" title="Link1">
              {/* <Image src=" " alt='LINK_ICON'> */}
            </a>
          </span>
        </div>
      </div>
    </>
  );
}

export default Footer;
