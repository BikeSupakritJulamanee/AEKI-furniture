import React, { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";

// Firebase
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";

// Component
import Nav from "./Nav";

function Member_List() {
  const [memberList, setMemberList] = useState([]);
  const read_member = async () => {
    const q = query(collection(db, "user"), orderBy("member_point", "desc"));
    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const jsonData = JSON.stringify(newData); // Convert to JSON string
    console.log(jsonData);
    setMemberList(JSON.parse(jsonData)); // Convert the JSON string to an array
  };

  useEffect(() => {
    read_member();
  }, []);

  return (
    <>
      <Nav />
      <Container>
        <br />
        <center>
          <h1>ลูกค้าดีเด่น</h1>
        </center>
        <br />
        <Table responsive="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>email, gmail</th>
              <th>ID สมาชิก</th>
              <th>หมายเลขโทรศัพท์</th>
              <th>เเต้มสมาชิก</th>
            </tr>
          </thead>
          <tbody>
            {memberList.map((i, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{i.email}</td>
                <td>{i.id}</td>
                <td>{i.phone_number}</td>
                <td>{i.member_point}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Member_List;
