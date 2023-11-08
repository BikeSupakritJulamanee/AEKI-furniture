import React from "react";

import FooterCSS from "./style/Footer.module.css";

function Footer() {
  return (
    <>
      <footer>
        <div className={FooterCSS.footer_line}></div>
        <div className={FooterCSS.footer_wrapper}>
          <section className={FooterCSS.footer_top}>
            <div className={FooterCSS.footer_headline}>
              <h2>Furniture and home decorations</h2>
              <p>
                {" "}
                ช้อปเอกิออนไลน์ได้ตลอด 24 ชม. ง่าย ปลอดภัย และสะดวก
                พร้อมบริการหลากหลาย เรารับประกัน{" "}
              </p>
            </div>
          </section>
          <div className={FooterCSS.footer_columns}>
            <section className={FooterCSS.footer_logo}>
              <h2>IKEA</h2>
            </section>
            <section></section>
            <section></section>
            <section></section>
            <section>
              <h3>รายระเอียดหัวข้อ</h3>
              <ul>
                <li>
                  <a href="/home" title="Main">
                    หน้าหลัก
                  </a>
                </li>
                <li>
                  <a href="/userorderlist" title="Cast_product">
                    สินค้าในตะกร้า
                  </a>
                </li>
                <li>
                  <a href="/order_history" title="History">
                    ประวัติการสั่งซื้อ
                  </a>
                </li>
              </ul>
            </section>
          </div>
          <div className={FooterCSS.footer_bottom}>
            <small>© My Company Ltd. 2023, All rights reserved</small>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
