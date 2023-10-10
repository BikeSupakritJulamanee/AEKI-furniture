import React, { useState, useEffect } from 'react'
import { Container, Row, Image, Card, Table } from 'react-bootstrap'

//firebase
import { collection, query, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../firebase'

//component
import Nav from './Nav';

function Member_List() {

    const [memberList, setMemberList] = useState([]);

    // call read_member()
    useEffect(() => {
        read_member()
    }, [])

    // read member order by member point
    const read_member = async () => {
        const q = query(collection(db, 'user'), orderBy('member_point', 'desc'))
        const querySnapshot = await getDocs(q)
        const newData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }))
        setMemberList(newData);
    }

    return (
        <>
            <Nav />
            <Container>
                <br />
                <center><h1>ลูกค้าดีเด่น</h1></center>
                <br />
                {/* show member sort by member point */}
                <Table responsive="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>email,gmail</th>
                            <th>ID สมาชิก</th>
                            <th>หมายเลขโทรศัพท์</th>
                            <th>เเต้มสมาชิก</th>
                        </tr>
                    </thead>
                    {memberList.map((i, index) => (
                        <tbody key={index}  >
                            <tr>
                                <td>{index + 1}</td>
                                <td>{i.email}</td>
                                <td>{i.id}</td>
                                <td>{i.phone_number}</td>
                                <td>{i.member_point}</td>

                            </tr>
                        </tbody>
                    ))}
                </Table>
            </Container>
        </>
    )
}

export default Member_List