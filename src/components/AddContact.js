import React, { useState } from "react";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import "./AddContact.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AddContact = (props) => {
  const [contactName, setContactName] = useState("");
  const [Phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  //Show Loading State Spinner if Data is Loading
  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spinner className="mt-5" animation="border" />
        <br />
        Saving Data...
      </div>
    );
  }

  //Handler to update Edited Contact name State Variable
  const contactNameHandler = (event) => {
    setContactName(event.target.value);
  };
  //Handler to update Edited Phone State Variable
  const phoneHandler = (event) => {
    setPhone(event.target.value);
  };

  //Error Toast Function
  const handleErrorToast = (toastMessage) => {
    toast.error(toastMessage, {
      position: "top-right", // Set the position of the toast
      autoClose: 2000, // Close the toast after 3 seconds
      hideProgressBar: false, // Show or hide the progress bar
      closeOnClick: true, // Close the toast on click
      pauseOnHover: true, // Pause the autoClose timer on hover
      draggable: true, // Make the toast draggable
    });
  };

  //Success Toast Function
  const handleSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right", // Set the position of the toast
      autoClose: 2000, // Close the toast after 3 seconds
      hideProgressBar: false, // Show or hide the progress bar
      closeOnClick: true, // Close the toast on click
      pauseOnHover: true, // Pause the autoClose timer on hover
      draggable: true, // Make the toast draggable
    });
  };

  const ValidateData = () => {
    if (contactName == "") {
      handleErrorToast("Please Enter Contact Name");
      return false;
    }
    if (Phone == "") {
      handleErrorToast("Please Enter Contact Number");
      return false;
    }
    const digitPattern = /^\d+$/;
    if (
      !digitPattern.test(Phone) ||
      (digitPattern.test(Phone) && Phone.length > 10)
    ) {
      handleErrorToast("Please Enter Valid Contact Number");
      return false;
    }
    return true;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    let validationStatus = ValidateData();
    let docId = Math.random().toString();
    let contactsData = {
      ...props.data,
      id: docId,
      name: contactName,
      phone: Phone,
    };
    if (validationStatus) {
      //API to Save Data
      setLoading(true);
      try {
        fetch("https://jsonplaceholder.typicode.com/users", {
          method: "POST",
          body: JSON.stringify({
            name: contactName,
            phone: Phone,
            id: docId,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((json) => console.log(json));
      } catch (error) {
        console.log("Error Occured While Saving Data is" + error.message);
      } finally {
        setLoading(false);
      }
      props.saveContactsHandler(contactsData);
      handleSuccessToast("Data Saved SuccessFully");
      setContactName("");
      setPhone("");
    } else {
      console.log("Validation Failed");
    }
  };

  return (
    <div className="AddContactsWrapper">
      <Container>
        <Row
          className="col-md-7 mx-auto bg-secondary align-items-center p-1"
          direction="horizontal"
        >
          <Col>
            <div className="p-2">
              <input
                type="text"
                name="contactName"
                id="contactName"
                placeholder="Name"
                onChange={contactNameHandler}
                value={contactName}
              />
            </div>
          </Col>
          <Col>
            <div className="p-2">
              <input
                type="text"
                name="Phone"
                id="Phone"
                placeholder="Phone Number"
                onChange={phoneHandler}
                value={Phone}
              />
            </div>
          </Col>
          <Col>
            <div className="saveBtnContainer p-2 ms-auto">
              <Button
                variant="success"
                className="saveBtn"
                onClick={submitHandler}
              >
                Save
              </Button>
            </div>
            <ToastContainer />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default AddContact;
