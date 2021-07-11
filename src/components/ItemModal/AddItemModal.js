import { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from "reactstrap";
import Swal from "sweetalert2";
import { storage, database } from "../Firebase/FirebaseConfig";
import { v4 as uuidv4 } from "uuid";
const AddItemModal = ({ isOpen, toggle, data }) => {
  const [itemForm, setItemForm] = useState({});
  const [imageFile, setImageFile] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const onChangeForm = ({ target }) => {
    setItemForm((prevState) => ({
      ...prevState,
      [target.name]:
        target.name === "qty" || target.name === "sellPrice" || target.name === "buyPrice"
          ? parseInt(target.value)
          : target.value,
    }));
  };

  const onChangeImage = ({ target }) => {
    if (target.files[0].length || !target.files[0]) return;
    if (target.files[0].size > 100000) return Swal.fire("Error", "Maksimal ukuran file 100kb", "error");
    setImageFile((prevState) => ({ ...prevState, file: target.files[0] }));
    setImagePreview(URL.createObjectURL(target.files[0]));
  };

  const onClickSubmit = async () => {
    if (!itemForm.name) return Swal.fire("Error", "Harap isi nama barang", "error");
    if (!itemForm.qty) return Swal.fire("Error", "Harap isi jumlah stock barang", "error");
    if (!itemForm.buyPrice) return Swal.fire("Error", "Harap isi harga beli barang", "error");
    if (!itemForm.sellPrice) return Swal.fire("Error", "Harap isi harga jual barang", "error");
    if (!imageFile.file) return Swal.fire("Error", "Harap pilih gambar", "error");

    let nameChecker = data.some((check) => check.name === itemForm.name);
    if (nameChecker) return Swal.fire("Error", "Harap pilih name lain", "error");

    const uploadTask = storage.ref(`image_files/${imageFile.file.name}`).child(imageFile.file.name).put(imageFile.file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        throw error;
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          database
            .collection("items")
            .add({
              ...itemForm,
              imageName: imageFile.file.name.toString(),
              imgURL: downloadURL.toString(),
              createdAt: new Date(),
              uuid: uuidv4(),
            })
            .then(() => {
              Swal.fire("Success", "add item Success", "success");
              toggle();
              setItemForm({});
            })
            .catch((error) => {
              Swal.fire("Error", "Add item failed", "error");
              throw error;
            });
        });
      }
    );
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader>Add Item</ModalHeader>
      <ModalBody className="d-flex justify-content-center align-items-center flex-column">
        <img
          src={imagePreview || "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png?w=640"}
          alt="placeholder"
          style={{ width: "200px", height: "200px", objectFit: "contain" }}
        />
        <form className="d-flex w-100 flex-column justify-content-center align-items-center">
          <FormGroup className="mt-3 w-75">
            <Label>Item Name</Label>
            <Input type="text" name="name" id="name" placeholder="Add item name" onChange={onChangeForm} required />
          </FormGroup>
          <FormGroup className="mt-3 w-75">
            <Label>Stock</Label>
            <Input type="number" name="qty" id="qty" placeholder="Add item stock" onChange={onChangeForm} required />
          </FormGroup>
          <FormGroup className="mt-3 w-75">
            <Label>Buy Price</Label>
            <Input
              type="number"
              name="buyPrice"
              id="buyPrice"
              placeholder="Add buy value"
              onChange={onChangeForm}
              required
            />
          </FormGroup>
          <FormGroup className="mt-3 w-75">
            <Label>Sell Price</Label>
            <Input
              type="number"
              name="sellPrice"
              id="sellPrice"
              placeholder="Add sell value"
              onChange={onChangeForm}
              required
            />
          </FormGroup>

          <FormGroup className="mt-3 d-flex flex-column w-75" color="primary">
            <Label
              for="image"
              className="text-center rounded p-2"
              style={{ color: "white", backgroundColor: "blue", border: "none" }}
            >
              Choose Image
            </Label>
            <Input
              type="file"
              accept="image/png, image/jpeg"
              name="image"
              id="image"
              style={{ display: "none" }}
              onChange={onChangeImage}
              required
            />
          </FormGroup>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClickSubmit}>
          Save
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddItemModal;
