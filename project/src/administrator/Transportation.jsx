import React, { useState, useEffect } from 'react';
import { Container, Image, Button, Form, Modal } from 'react-bootstrap';
import Nav from './Nav';
import { storageRef, db } from '../firebase';
import { getDocs, collection, query, addDoc, updateDoc, doc, deleteDoc, } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes, listAll, deleteObject } from 'firebase/storage';

function Transportation() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [transportCompanyName, setTransportCompanyName] = useState('');
    const [shippingCost, setShippingCost] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [imageUpload, setImageUpload] = useState(null);
    const [imageList, setImageList] = useState([]);
    const [selectedTransportCompany, setSelectedTransportCompany] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [fetchTransportCompanies, setFetchTransportCompanies] = useState([]);
    const handleShowAddModal = () => setShowAddModal(true);
    const imageListRef = ref(storageRef, 'transaction/');

    useEffect(() => {
        fetchProducts();
        listAll(imageListRef)
            .then((response) => Promise.all(response.items.map((item) => getDownloadURL(item))))
            .then((urls) => setImageList(urls))
            .catch((error) => console.error('Error listing images:', error));
    }, []);

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        clearFormFields();
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        clearFormFields();
    };

    const handleShowEditModal = (company) => {
        setSelectedTransportCompany(company);
        setTransportCompanyName(company.transportCompanyName);
        setShippingCost(company.shippingCost);
        setShowEditModal(true);
    };

    const clearFormFields = () => {
        setTransportCompanyName('');
        setShippingCost('');
        setSelectedFile(null);
        setFileName('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            setImageUpload(file);
        }
    };

    const handleAddSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();

        const createProduct = await addDoc(collection(db, 'transportation'), {
            transportCompanyName: transportCompanyName,
            shippingCost: parseFloat(shippingCost),
            img: fileName,
        });

        if (imageUpload) {
            const imageRef = ref(storageRef, `transaction/${imageUpload.name}`);
            const snapshot = await uploadBytes(imageRef, imageUpload);
            const url = await getDownloadURL(snapshot.ref);
            setImageList((prev) => [...prev, url]);
        }
        setLoading(false)

        handleCloseAddModal();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (selectedTransportCompany) {
            const companyDocRef = doc(db, 'transportation', selectedTransportCompany.id);
            if (fileName != '') {
                await updateDoc(companyDocRef, {
                    transportCompanyName: transportCompanyName,
                    shippingCost: parseFloat(shippingCost),
                    img: fileName

                });
            }
            else {
                await updateDoc(companyDocRef, {
                    transportCompanyName: transportCompanyName,
                    shippingCost: shippingCost,
                });
            }


            if (imageUpload) {
                // Delete the old image if a new one is uploaded
                const oldImageRef = ref(storageRef, `transaction/${selectedTransportCompany.img}`);
                await deleteObject(oldImageRef);

                // Upload the new image
                const imageRef = ref(storageRef, `transaction/${imageUpload.name}`);
                const snapshot = await uploadBytes(imageRef, imageUpload);
                const url = await getDownloadURL(snapshot.ref);
                setImageList((prev) => [...prev, url]);
            }

            handleCloseEditModal();
        }
    };

    const handleDeleteCompany = async () => {
        if (selectedTransportCompany) {
            try {
                // // Delete the image associated with the company from storage
                const imageRef = ref(storageRef, `transaction/${selectedTransportCompany.img}`);
                await deleteObject(imageRef);

                // Delete the company document from Firestore
                const companyDocRef = doc(db, 'transportation', selectedTransportCompany.id);
                await deleteDoc(companyDocRef);

                // // Remove the deleted company from the list
                setFetchTransportCompanies((prevCompanies) =>
                    prevCompanies.filter((company) => company.id !== selectedTransportCompany.id)
                );

                // Close the edit modal
                handleCloseEditModal();
            } catch (error) {
                console.error('Error deleting company:', error);
            }
        }
    };

    const fetchProducts = async () => {
        try {
            const q = query(collection(db, 'transportation'));

            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setFetchTransportCompanies(newData);
        } catch (error) {
            console.error('Error fetching account data:', error);
        }
    };

    return (
        <>
            <Nav />
            <Container>
                <Button variant="dark" onClick={handleShowAddModal}>
                    &#43;เพิ่มช่องทางการขนส่ง
                </Button>
                <hr />

                {/* Add Modal */}
                <Modal show={showAddModal} onHide={handleCloseAddModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>เพิ่มช่องทางการขนส่ง</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleAddSubmit}>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    placeholder="ชื่อบริษัทขนส่ง"
                                    value={transportCompanyName}
                                    onChange={(e) => setTransportCompanyName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    type="number"
                                    placeholder="ค่าบริการ"
                                    value={shippingCost}
                                    onChange={(e) => setShippingCost(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>รูปภาพ</Form.Label>
                                <Form.Control
                                    className="input-small"
                                    type="file"
                                    onChange={handleFileChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="success" type="submit" disabled={isLoading}>
                                {isLoading ? 'Loading…' : 'เพิ่มช่องทางการขนส่ง'}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Edit Modal */}
                <Modal show={showEditModal} onHide={handleCloseEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>แก้ไขรายละเอียดขนส่ง</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    placeholder="ชื่อบริษัทขนส่ง"
                                    value={transportCompanyName}
                                    onChange={(e) => setTransportCompanyName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    type="number"
                                    placeholder="ค่าบริการ"
                                    value={shippingCost}
                                    onChange={(e) => setShippingCost(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>เปลี่ยนรูปภาพ</Form.Label>
                                <Form.Control
                                    className="input-small"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                            <Button type="submit">แก้ไข</Button>
                            <Button variant="danger" onClick={handleDeleteCompany}>
                                ลบ
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Display Transportation Companies */}
                {fetchTransportCompanies.map((company, index) => (
                    <span key={index}>
                        <Image
                            onClick={() => handleShowEditModal(company)}
                            className="img"
                            src={imageList.find((url) => url.includes(company.img))}
                            style={{ width: '180px', height: '120px' }}
                        />
                    </span>
                ))}
            </Container>

        </>
    );
}

export default Transportation;