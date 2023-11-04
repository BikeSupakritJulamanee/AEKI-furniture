import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  Stack,
} from "react-bootstrap";
import { db } from "../firebase";
import {
  query,
  collection,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import classNames from "classnames";
import ProductListCSS from "./style/Product_List.module.css";

function Product_List() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [select, setSelect] = useState("");
  const [productTypeList, setProductTypeList] = useState([]);
  const [ifOrderBySales, setIfOrderBySales] = useState();

  useEffect(() => {
    fetchProducts();
    fetchType();
  }, [select, searchTerm, ifOrderBySales]);

  const fetchProducts = async () => {
    try {
      let q = collection(db, "products");

      if (select !== "") {
        q = query(q, where("type", "==", select));
      }

      if (searchTerm !== "") {
        q = query(q, orderBy("name"), where("name", ">=", searchTerm));
      }

      if (ifOrderBySales === true) {
        q = query(q, orderBy("salses", "desc"));
      }

      if (ifOrderBySales === false) {
        q = query(q, orderBy("salses"));
      }

      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProducts(newData);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const productDocRef = doc(db, "products", id);
      await deleteDoc(productDocRef);
      console.log("Document successfully deleted!");
      alert("Document successfully deleted!");
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Error deleting document: " + error.message);
    }
  };

  const fetchType = async () => {
    try {
      const q = query(collection(db, "type"), orderBy("productType"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProductTypeList(newData);
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  return (
    <>
      <Nav />
      <Container>
        <br />
        <center>
          <h1>คลังสินค้า</h1>
        </center>

        <center>
          <Form.Group>
            <Form.Control
              className={ProductListCSS.search_bar}
              type="text"
              placeholder="ค้นหาด้วยชื่อผลิตภัณฑ์"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </center>

        <br />

        <Row>
          <Stack direction="horizontal" gap={1}>
            <div className="p-2">
              <Col>
                <Form.Group>
                  <Form.Select
                    className={ProductListCSS.select_productType}
                    placeholder="Type"
                    onChange={(e) => setSelect(e.target.value)}
                    required
                  >
                    <option value={""}>ค้นหาด้วยประเภทสินค้า</option>
                    {productTypeList.map((typeObj, index) => (
                      <option key={index} value={typeObj.productType}>
                        👉🏼
                        {typeObj.productType}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </div>
            <div className="p-2">
              <Col>
                <Form.Group>
                  <Form.Select
                    className={ProductListCSS.select_productType}
                    placeholder="Type"
                    onChange={(e) =>
                      setIfOrderBySales(e.target.value === "true")
                    }
                    required
                  >
                    <option>จัดเรียงด้วยยอดขาย</option>
                    <option value={true}>สูงไปต่ำ</option>
                    <option value={false}>ต่ำไปสูง</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </div>
          </Stack>
        </Row>

        <br />

        <Table hover responsive>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>ชื่อผลิตภัณฑ์</th>
              {/* <th>Description</th> */}
              <th>ราคาสินค้า</th>
              <th>คลัง</th>
              {/* <th>Type</th> */}
              <th>ยอดขาย</th>
              <th className={ProductListCSS.sticky_right}>#</th>
              <th className={ProductListCSS.sticky_right2}>#</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                {/* <td>{product.id}</td> */}
                <td>{product.name}</td>
                {/* <td>{product.description}</td> */}
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                {/* <td>{product.type}</td> */}
                <td>{product.salses}</td>
                <td className={ProductListCSS.sticky_right}>
                  <Link
                    to={`/edit_products?id=${encodeURIComponent(
                      product.id
                    )}&name=${encodeURIComponent(
                      product.name
                    )}&quantity=${encodeURIComponent(
                      product.quantity
                    )}&description=${encodeURIComponent(
                      product.description
                    )}&image=${encodeURIComponent(
                      product.img
                    )}&price=${encodeURIComponent(
                      product.price
                    )}&type=${encodeURIComponent(
                      product.type
                    )}&attribute=${encodeURIComponent(product.attribute)}`}
                    target="_blank"
                  >
                    <Button
                      className={classNames(ProductListCSS.bt, "btn--primary")}
                      variant="info"
                    >
                      Edit
                    </Button>
                  </Link>
                </td>

                <td className={ProductListCSS.sticky_right2}>
                  <Button
                    className={classNames(ProductListCSS.bt, "btn--primary")}
                    variant="danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}
export default Product_List;
