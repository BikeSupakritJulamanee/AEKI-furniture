import React, { useState, useEffect } from "react";
import { Container, Row, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

//firebase
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { db, storageRef } from "../firebase";

//component
import Nav from "./Nav";

function OutOfStock() {
  const [out_of_stock, setOut_Of_Stock] = useState([]);
  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storageRef, "products/");

  // call read_out_of_stock()
  useEffect(() => {
    read_out_of_stock();
  }, []);

  // read image in products folder
  useEffect(() => {
    listAll(imageListRef)
      .then((response) =>
        Promise.all(response.items.map((item) => getDownloadURL(item)))
      )
      .then((urls) => setImageList(urls))
      .catch((error) => console.error("Error listing images:", error));
  }, []);

  //Read_out of sstock in products table ,order by type
  const read_out_of_stock = async () => {
    const q = query(collection(db, "products"), where("quantity", "==", 0));
    const customSort = (a, b) => {
      const thaiLocale = "th-TH";
      const collator = new Intl.Collator(thaiLocale, { sensitivity: "base" });
      return collator.compare(a.type, b.type);
    };
    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      .sort(customSort);
    setOut_Of_Stock(newData);
  };

  return (
    <>
      <Nav />
      <Container>
        <center>
          <h1>สินค้าหมด</h1>
        </center>

        {out_of_stock.map((i, index) => (
          <div key={index} style={{ display: "inline" }}>
            {/* link to /edit_products with variable */}
            <Link
              to={`/edit_products?id=${encodeURIComponent(
                i.id
              )}&name=${encodeURIComponent(
                i.name
              )}&quantity=${encodeURIComponent(
                i.quantity
              )}&description=${encodeURIComponent(
                i.description
              )}&image=${encodeURIComponent(i.img)}&price=${encodeURIComponent(
                i.price
              )}&type=${encodeURIComponent(
                i.type
              )}&attribute=${encodeURIComponent(i.attribute)}`}
              target="_blank"
            >
              {/* show products is out of stock */}
              <Card className="card" style={{ width: "300px" }}>
                <Image
                  className="img"
                  src={imageList.find((url) => url.includes(i.img))}
                  style={{ width: "290px", height: "300px" }}
                />
                <Card.Body>
                  <div className="product_name">{i.name}</div>
                  <div className="product_description">{i.description}</div>
                  <div>
                    <span className="product_price">
                      {i.price.toLocaleString()}
                    </span>
                    <b className="bath"> บาท</b>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </div>
        ))}
      </Container>
    </>
  );
}
export default OutOfStock;
