import React,{useState,useEffect} from 'react'
import Nav_Bar from "../component/Nav_Bar";
import { Container, Table, Button, Form } from "react-bootstrap";
import { db } from "../firebase";
import { query, collection, where, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { format } from 'date-fns';

function OrderHistory() {
    const [user_order,setuser_order] = useState([]);
    const [user_cart,setuser_cart] = useState([]);
    const [user_ship,setuser_ship] = useState([]);
    const [MatchingProducts,setMatchingProducts] = useState([]);
    const { user } = useUserAuth();

    useEffect(() => {
        fetchOrder();
        fetchProduct();
        fetchCart();
        fetchshipping();
      }, [user_cart,user]);

      // useEffect(() => {
      //   fetchOrder();
      //   fetchProduct();
      //   fetchCart();
      //   fetchshipping();
      // }, []);

      const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return format(date, 'dd/MM/yyyy HH:mm:ss');
    };


    const fetchOrder = async () => {
        try {
          const q = query(collection(db, 'order'));
          const querySnapshot = await getDocs(q);
          const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setuser_order(newData);
        } catch (error) {
          console.error('Error fetching account data:', error);
        }
      };

      const fetchshipping = async () => {
        try {
          const orderIds = user_order.map((order) => order.id);
          const q = query(collection(db, 'shipping'),where("orderID", "in", orderIds)); 
          const querySnapshot = await getDocs(q);
          const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setuser_ship(newData);
        } catch (error) {
          console.error('Error fetching shipping data:', error);
        }
      };
      


      const fetchCart = async () => {
        try {
          const q = query(collection(db, 'cart'),where("email", "==", user.email));
          const querySnapshot = await getDocs(q);
          const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setuser_cart(newData);
        } catch (error) {
          console.error('Error fetching account data:', error);
        }
      };

      const fetchProduct = async () => {
        if (user.email) {
            const q = query(
                collection(db, "products")
            );
    
            try {
                const querySnapshot = await getDocs(q);
                const newDataproducts = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
    
                if (newDataproducts.length > 0) {
                    const matching = [];
    
                    if (user_cart.length > 0) {
                        user_order.forEach((order) => {
                            order.product_id.forEach((cartProductId) => {
                                const productMatch = newDataproducts.find((product) => product.id === cartProductId);
                                if (productMatch) {
                                    matching.push({
                                        orderId: order.id, 
                                        productName: productMatch.name,
                                        productQuantity: order.quantityPerProductID[cartProductId],
                                    });
                                }
                            });
                        });
                    }
    
                    setMatchingProducts(matching);
                    console.log(MatchingProducts);
                }
            } catch (error) {
                console.error("Error fetching products data:", error);
            }
        }
    };
    

      

  return (
    <div>
        <Nav_Bar/>
        <Container>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ORDER_ID</th>
              <th>Name</th>
              <th>PRODUCT</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {user_order.map((order,index)=>(
                <tr>
                <td>{order.id}</td>
                <td>{order.email}</td>
                <td>
                {MatchingProducts.map((productInfo) => (
                    productInfo.orderId === order.id && (
                        <div>{productInfo.productName}</div>
                    )
                ))}
            </td>
            <td>
                {MatchingProducts.map((productInfo) => (
                    productInfo.orderId === order.id && (
                        <div>{productInfo.productQuantity}</div>
                    )
                ))}
            </td>
                <td>{order.amount}</td>
                <td>{formatTimestamp(order.Date?.seconds * 1000)}</td>
                <td>{user_ship[index]?.status || 'กรุณารอสักครู่'}</td>
                </tr>
            ))}
          </tbody>
        </Table>
        <div style={{ textAlign: 'center'}}><Link to="/home">กลับหน้าเเรก</Link></div>
      </Container>
    </div>
  )
}

export default OrderHistory
