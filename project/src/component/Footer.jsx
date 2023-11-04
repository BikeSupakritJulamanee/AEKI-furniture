import React from "react";

import FooterCSS from "./style/Footer.module.css";

function Footer() {
  return (
    <>
      <div className={FooterCSS.footer_line}></div>
      <div className={FooterCSS.footer_wrapper}>
        <section className={FooterCSS.footer_top}>
          <div className={FooterCSS.footer_headline}>
            <h2>Topics Details</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Assumenda, ab iusto modi quo, at vel suscipit distinctio impedit
              tempore non et adipisci molestiae quasi dolores rem repellat
              aliquam! Est, illo.
            </p>
          </div>
        </section>
        <div className={FooterCSS.footer_columns}>
          <section className={FooterCSS.footer_logo}>
            <h2 className="hide">IKEA</h2>
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
          <span className="social-links">
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
