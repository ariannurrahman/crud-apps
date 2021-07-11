import { useEffect, useState } from "react";
import { Button, Row, Container, Col, Card } from "reactstrap";

import { database } from "../Firebase/FirebaseConfig";
import AddItemModal from "../ItemModal/AddItemModal";
import ItemList from "./ItemList";
const Home = () => {
  const [dataList, setDataList] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);

  console.log(dataList);

  useEffect(() => {
    database.collection("items").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setDataList((prevState) => [...prevState, { ...change.doc.data(), id: change.doc.id }]);
        }
      });
    });
  }, [setDataList]);

  const addItemToggle = () => {
    setShowAddItem(!showAddItem);
  };

  return (
    <Container>
      <Col className="mb-5">
        <Card>
          <Row xs="12" className="text-center my-5">
            <h1>Welcome!</h1>
          </Row>
          <Row className="d-flex justify-content-center aligns-item-center mb-5">
            <Col className="text-end align-middle">
              <h4 className="m-0 p-0">Get started with</h4>
            </Col>
            <Col>
              <Button onClick={addItemToggle} color="primary">
                Add an item
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
      <Row>
        <h3>Total product(s): {dataList.length}</h3>
      </Row>
      <ItemList data={dataList} />
      <AddItemModal toggle={addItemToggle} isOpen={showAddItem} data={dataList} />
    </Container>
  );
};

export default Home;
