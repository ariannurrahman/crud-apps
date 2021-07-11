import { useEffect, useState } from "react";
import { Col, Card, CardImg, CardText, CardBody, CardTitle, CardFooter, Button, Row } from "reactstrap";
import EditItemModal from "../ItemModal/EditItemModal";
import DeleteItemModal from "../ItemModal/DeleteItemModal";
const ItemList = ({ data }) => {
  const [dataList, setDataList] = useState([]);

  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [idToEdit, setIdToEdit] = useState("");

  useEffect(() => {
    if (!data.length) return;
    setDataList(data);
  }, [data]);

  const editModalToggle = () => {
    setIsOpenEdit(!isOpenEdit);
  };

  const deleteModalToggle = () => {
    setIsOpenDelete(!isOpenDelete);
  };

  return (
    <Row xs="12" style={{ height: "100%" }} className="d-flex flex-row justify-content-center">
      {dataList.length ? (
        dataList.map((item, index) => {
          return (
            <Col
              className="py-3"
              style={{ minWidth: "300px", maxWidth: "300px", height: "100%", position: "relative" }}
              key={index}
            >
              <Card className="shadow-sm">
                <CardImg
                  top
                  width="100%"
                  src={item.imgURL}
                  alt="Card image cap"
                  className=" border-bottom p-4"
                  style={{ width: "100%", minHeight: "300px", maxHeight: "300px", objectFit: "contain" }}
                />
                <CardBody>
                  <CardTitle tag="h5" className="text-center mb-3">
                    {item.name || "-"}
                  </CardTitle>

                  <CardText className="mt-4">Stock: {item.qty || 0}</CardText>
                  <CardText>Harga beli: {item.buyPrice || 0}</CardText>
                  <CardText>Harga jual: {item.sellPrice || 0}</CardText>
                  <CardFooter
                    style={{ backgroundColor: "transparent" }}
                    className="d-flex w-100 justify-content-center"
                  >
                    <Button
                      color="secondary"
                      className="mx-1"
                      onClick={() => {
                        editModalToggle();
                        setIdToEdit(item.id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      className="mx-1"
                      onClick={() => {
                        deleteModalToggle();
                        setIdToEdit(item.id);
                      }}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </CardBody>
              </Card>
            </Col>
          );
        })
      ) : (
        <h1>No Item..</h1>
      )}
      <EditItemModal toggle={editModalToggle} isOpen={isOpenEdit} id={idToEdit} data={dataList} />
      <DeleteItemModal toggle={deleteModalToggle} isOpen={isOpenDelete} id={idToEdit} />
    </Row>
  );
};

export default ItemList;
