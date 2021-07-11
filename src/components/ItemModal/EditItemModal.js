import { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from "reactstrap";
import Swal from "sweetalert2";
import { database, storage } from "../Firebase/FirebaseConfig";

const EditItemModal = ({ isOpen, toggle, id, data }) => {
  const [dataToEdit, setDataToEdit] = useState({});
  const [imageFile, setImageFile] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!id) return;
    database
      .collection("items")
      .doc(id)
      .get()
      .then((doc) => {
        setDataToEdit(doc.data());
      })
      .catch((error) => {
        throw error;
      });
  }, [id]);

  const onChangeEdit = ({ target }) => {
    setDataToEdit((prevState) => ({ ...prevState, [target.name]: target.value }));
  };

  const onChangeImage = ({ target }) => {
    if (target.files[0].length || !target.files[0]) return;
    if (target.files[0].size > 100000) return Swal.fire("Error", "Maximal ukuran file 100kb", "error");
    setImageFile((prevState) => ({ ...prevState, file: target.files[0] }));
    setImagePreview(URL.createObjectURL(target.files[0]));
  };
  const onClickSaveEdit = async () => {
    if (!dataToEdit.name) return Swal.fire("Error", "Harap isi nama barang", "error");
    if (!dataToEdit.qty) return Swal.fire("Error", "Harap isi jumlah stock barang", "error");
    if (!dataToEdit.buyPrice) return Swal.fire("Error", "Harap isi harga beli barang", "error");
    if (!dataToEdit.sellPrice) return Swal.fire("Error", "Harap isi harga jual barang", "error");

    let nameChecker = data.some((check) => check.name === dataToEdit.name);
    if (nameChecker) return Swal.fire("Error", "Harap pilih name lain", "error");

    if (imageFile.file) {
      const uploadTask = storage
        .ref(`image_files/${imageFile.file.name}`)
        .child(imageFile.file.name)
        .put(imageFile.file);
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
              .doc(id)
              .set({
                ...dataToEdit,
                imageName: imageFile.file.name.toString(),
                imgURL: downloadURL.toString(),
                createdAt: new Date(),
              })
              .then(() => {
                toggle();
                Swal.fire("Success", "Edit item success", "success").then((res) => {
                  if (res.isConfirmed || res.isDismissed) {
                    window.location.reload();
                  }
                });
              })
              .catch((error) => {
                Swal.fire("Error", "Edit item error", "error");
                throw error;
              });
          });
        }
      );
    }

    if (!imageFile.file) {
      database
        .collection("items")
        .doc(id)
        .set({
          ...dataToEdit,
          imageName: dataToEdit.imageName.toString(),
          imgURL: dataToEdit.imgURL.toString(),
          createdAt: new Date(),
        })
        .then(() => {
          toggle();
          Swal.fire("Success", "Edit item success", "success").then((res) => {
            if (res.isConfirmed || res.isDismissed) {
              window.location.reload();
            }
          });
        })
        .catch((error) => {
          Swal.fire("Error", "Edit item error", "error");
          throw error;
        });
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader>Edit Item</ModalHeader>
      <ModalBody className="d-flex justify-content-center align-items-center flex-column">
        <img
          src={imagePreview ? imagePreview : dataToEdit.imgURL}
          alt="placeholder"
          style={{ width: "200px", height: "200px", objectFit: "contain" }}
        />
        <form className="d-flex w-100 flex-column justify-content-center align-items-center">
          <FormGroup className="mt-3 w-75">
            <Label>Item Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Add item name"
              required
              value={dataToEdit.name || ""}
              onChange={onChangeEdit}
            />
          </FormGroup>
          <FormGroup className="mt-3 w-75">
            <Label>Stock</Label>
            <Input
              type="number"
              name="qty"
              id="qty"
              placeholder="Add item stock"
              required
              value={dataToEdit.qty || 0}
              onChange={onChangeEdit}
            />
          </FormGroup>
          <FormGroup className="mt-3 w-75">
            <Label>Buy Price</Label>
            <Input
              type="number"
              name="buyPrice"
              id="buyPrice"
              placeholder="Add buy value"
              required
              value={dataToEdit.buyPrice || 0}
              onChange={onChangeEdit}
            />
          </FormGroup>
          <FormGroup className="mt-3 w-75">
            <Label>Sell Price</Label>
            <Input
              type="number"
              name="sellPrice"
              id="sellPrice"
              placeholder="Add sell value"
              required
              value={dataToEdit.sellPrice || 0}
              onChange={onChangeEdit}
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
              accept="image/*"
              name="image"
              id="image"
              value=""
              style={{ display: "none" }}
              onChange={onChangeImage}
              required
            />
          </FormGroup>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClickSaveEdit}>
          Save
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditItemModal;
