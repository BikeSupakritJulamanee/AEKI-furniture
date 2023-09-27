import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { Container, Table, Button, Form } from "react-bootstrap";
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

function Product_List() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [select, setSelect] = useState("");
  // const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      let q;

      if (select !== "") {
        q = query(collection(db, "products"), where("type", "==", select));
      } else if (searchTerm !== "") {
        q = query(
          collection(db, "products"),
          where("name", ">=", searchTerm),
          orderBy("name")
        );
      } else {
        // Fetch all products when neither search term nor category is selected
        q = query(collection(db, "products"), orderBy("name"));
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

  useEffect(() => {
    fetchProducts();
  }, [select]);

  return (
    <>
      <Nav />
      {select}
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

        <Form.Select
          aria-label="Default select example"
          onChange={(e) => setSelect(e.target.value)}
        >
          <option value="">Select a category</option>
          <option value="ของตกเเต่งบ้าน">ของตกเเต่งบ้าน</option>
          <option value="เตียง">เตียง</option>
          <option value="เก้าอี้">เก้าอี้</option>
        </Form.Select>

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
                    to={`/edit_products?id=${encodeURIComponent(product.id)}&name=${encodeURIComponent(
                      product.name
                    )}&quantity=${encodeURIComponent(product.quantity)}&description=${encodeURIComponent(
                      product.description
                    )}&image=${encodeURIComponent(product.img)}&price=${encodeURIComponent(
                      product.price
                    )}`} E
                  // target='_blank'
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
