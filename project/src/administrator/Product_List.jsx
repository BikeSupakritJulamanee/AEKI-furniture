import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { Container, Table, Button, Form } from "react-bootstrap";
import { db } from "../firebase";
import { query, collection, where, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";

function Product_List() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [select, setSelect] = useState("");
  const [productTypeList, setProductTypeList] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchType();
  }, [select]);

  const fetchProducts = async () => {
    try {
      let q = collection(db, "products");

      if (select !== "") {
        q = query(q, where("type", "==", select));
      }

      if (searchTerm !== "") {
        q = query(q, where("name", ">=", searchTerm), orderBy("name"));
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
      const q = query(collection(db, 'type'), orderBy("productType"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setProductTypeList(newData);
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  return (
    <>
      <Nav />
      <Container>
        <Form.Group className="search_group">
          <Form.Control
            className="search_bar"
            type="text"
            placeholder="ค้นหาด้วยชื่อผลิตภัณฑ์"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button className="search_btn" onClick={fetchProducts}>
            ค้นหา
          </Button>
        </Form.Group>
        <hr />

        <Form.Group controlId="exampleForm.SelectCustom">
          <Form.Control
            as="select"
            className="input-small"
            placeholder="Type"
            onChange={(e) => setSelect(e.target.value)}
            required
          >
            <option value={""}>ทุกประเภทประเภท</option>
            {productTypeList.map((typeObj, index) => (
              <option key={index} value={typeObj.productType}>
                {typeObj.productType}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <hr />

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.type}</td>
                <td>
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
                    )}&attribute=${encodeURIComponent(
                      product.attribute
                    )}`}
                    target="_blank"
                  >
                    <Button>
                      Edit
                    </Button>
                  </Link>
                </td>
                <td>
                  <Button onClick={() => handleDelete(product.id)}>
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
