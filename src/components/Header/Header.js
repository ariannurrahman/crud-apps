import { useState } from "react";
import { Link } from "react-router-dom";
import { database } from "../Firebase/FirebaseConfig";
import { Button, Navbar, FormGroup, Collapse, Input, NavbarToggler } from "reactstrap";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState([]);
  const toggle = () => setIsOpen(!isOpen);

  const onClickSearch = async () => {
    database
      .collection("items")
      .where("qty", ">", 10)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((item) => setResult((prevState) => [...prevState, item.data()]));
      })
      .catch((error) => {
        throw error;
      });
  };
  console.log("searchValue: ", searchValue);
  console.log("result: ", result);

  return (
    <Navbar color="dark" light expand="md" className="px-3">
      <Link to="/" className="text-white text-decoration-none">
        AN
      </Link>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar className="justify-content-end">
        <FormGroup className="d-flex justify-content-center align-items-center">
          <Input
            className="m-2"
            type="search"
            name="search"
            id="search"
            placeholder="Search by item name.."
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button className="m-2" color="primary" onClick={onClickSearch}>
            Search
          </Button>
        </FormGroup>
      </Collapse>
    </Navbar>
  );
};

export default Header;
