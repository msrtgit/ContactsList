import React, { useState } from "react";
import { Button, Stack, Container, Table, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ContactsList.css";
import "remixicon/fonts/remixicon.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
const ContactsList = (props) => {
  const [editingRow, setEditingRow] = useState(null);
  const [contactName, setContactName] = useState("");
  const [Phone, setPhone] = useState("");
  const BASE_RUL = "https://jsonplaceholder.typicode.com/";
  let contactsData = props.data;
  const [loading, setLoading] = useState(false);

  //Show Loading State Spinner if Data is Loading
  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spinner className="mt-5" animation="border" />
        <br />
        Updating...
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

  //Sets Selected Row in Edit Mode
  const EditBtnClickhandler = (id) => {
    setEditingRow(id);
  };

  //Handle the Delete of Data by using Id
  const deleteContact = async (id) => {
    const userConfirmation = window.confirm("Do you want to proceed?");
    if (userConfirmation) {
      //API to Delete Resource
      setLoading(true);
      try {
        await fetch(BASE_RUL + `users/${id}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.log("Error Occured While Deleteing Contact is" + error.message);
      } finally {
        setLoading(false);
      }
      props.HandleDeleteContact(id);

      handleSuccessToast("Data Deleted SuccessFully");
    }
  };
  //Handle the Cancelling of Editing Data
  const cancelUpdateData = () => {
    setEditingRow(null);
  };

  //Validates Edited data
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

  const updateData = async (id) => {
    let validationStatus = ValidateData();
    if (validationStatus) {
      const data = {
        name: contactName,
        phone: Phone,
      };
      //API to Update Resource
      setLoading(true);
      try {
        await fetch(BASE_RUL + `users/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            id: id,
            name: contactName,
            phone: Phone,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then((json) => console.log(json));
      } catch (error) {
        console.log(
          "Error Occured While Updating Contact Info is" + error.message
        );
      } finally {
        setLoading(false);
      }
      //Update Local Data
      props.HandleUpdateData(id, data);
      setEditingRow(null);
      handleSuccessToast("Data Updated SuccessFully");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Container>
        <Stack gap={2} className="col-md-7 mx-auto mt-1">
          <Table striped bordered hover className="contactsListTable">
            <thead>
              <tr>
                <th>S.no</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactsData &&
                contactsData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      {editingRow == item.id ? (
                        <input type="text" onChange={contactNameHandler} />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td>
                      {editingRow == item.id ? (
                        <input type="text" onChange={phoneHandler} />
                      ) : (
                        item.phone
                      )}
                    </td>
                    <td>
                      {editingRow == item.id ? (
                        <>
                          <Button
                            variant="primary"
                            className="m-1"
                            onClick={() => updateData(item.id)}
                          >
                            <i className="ri-check-line"></i>
                          </Button>
                          &ensp;
                          <Button
                            variant="primary"
                            className="m-1"
                            onClick={() => cancelUpdateData()}
                          >
                            <i className="ri-close-fill"></i>
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          className="m-1"
                          onClick={() => EditBtnClickhandler(item.id)}
                        >
                          <i className="ri-edit-box-line"></i>
                        </Button>
                      )}
                      &ensp;
                      <Button
                        className="m-1"
                        variant="danger"
                        onClick={() => deleteContact(item.id)}
                      >
                        <i className="ri-delete-bin-6-line"></i>
                      </Button>
                      <ToastContainer />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Stack>
      </Container>
    </div>
  );
};
export default ContactsList;
