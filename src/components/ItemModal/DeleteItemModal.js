import { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from "reactstrap";
import Swal from "sweetalert2";
import { database } from "../Firebase/FirebaseConfig";
const DeleteItemModal = ({ id, isOpen, toggle }) => {
  const [confirmationText, setConfirmationText] = useState("");

  const onClickDelete = async () => {
    if (confirmationText !== "delete") return Swal.fire("Error", "Delete item failed", "error");

    if (!id) return;
    await database
      .collection("items")
      .doc(id)
      .delete()
      .then(() => {
        toggle();
        Swal.fire("Success", "Delete item Success", "success").then((res) => {
          if (res.isConfirmed || res.isDismissed) {
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        throw error;
      });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader>Are you sure you want to delete this item?</ModalHeader>
      <ModalBody className="d-flex justify-content-center align-items-center flex-column">
        <FormGroup className="w-100">
          <Label>
            Type <i>delete</i> to confirm
          </Label>
          <Input onChange={(event) => setConfirmationText(event.target.value)} type="text" />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onClickDelete}>
          Delete
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteItemModal;
