import React, { useEffect, useState } from "react";
import AddContact from "./AddContact";
import ContactsList from "./ContactsList";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Contacts = () => {
  const [contactlist, setContactsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_RUL = "https://jsonplaceholder.typicode.com/";

  //Function to Get Data of Contacts
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(BASE_RUL + "users");
      const result = await response.json();
      return result;
    } catch (error) {
      setLoading(false);
      setError(error);
      return [];
    }
  };

  //Load Data of Contacts
  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      const result = await fetchData();
      setContactsList(result);
      setLoading(false);
    };
    fetchDataAndUpdateState();
  }, []);

  //Display Error if Error is Occured
  if (error) {
    console.log(error.message);
    return <p>Error Occured Please Try Agian Later</p>;
  }

  //Show Loading State Spinner if Data is Loading
  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spinner className="mt-5" animation="border" />
        <br />
        Loading Data....
      </div>
    );
  }

  if (contactlist.length === 0) {
    return <h4>No Data Exist</h4>;
  }

  //Success Toast Function
  const handleSuccessToast = () => {
    toast.success("Operation successful!", {
      position: "top-right", // Set the position of the toast
      autoClose: 2000, // Close the toast after 3 seconds
      hideProgressBar: false, // Show or hide the progress bar
      closeOnClick: true, // Close the toast on click
      pauseOnHover: true, // Pause the autoClose timer on hover
      draggable: true, // Make the toast draggable
    });
  };

  //Handle Delete Action
  const HandleDeleteContact = async (id) => {
    const deleteContactRequestUrl = BASE_RUL + `users/${id}`;
    await fetch(deleteContactRequestUrl, {
      method: "DELETE",
    });
    let updatedContacts = contactlist.filter((user) => user.id != id);
    setContactsList(updatedContacts);
  };

  const saveContactsHandler = (data) => {
    setContactsList((prevContacts) => {
      return [data, ...prevContacts];
    });
  };
  const rowUpdate = (data) => {
    setContactsList(data);
  };
  const HandleUpdateData = (id, data) => {
    const modifiedObj = {
      id: id,
      ...data,
    };
    const updatedData = contactlist.map((item) => {
      return item.id === id ? modifiedObj : item;
    });
    setContactsList(updatedData);
  };

  return (
    <div>
      <h1 style={{ marginTop: 10, marginBottom: 10 }}>Contacts List</h1>
      <AddContact saveContactsHandler={saveContactsHandler} />
      <ContactsList
        data={contactlist}
        HandleDeleteContact={HandleDeleteContact}
        HandleUpdateData={HandleUpdateData}
        rowUpdate={rowUpdate}
      />
    </div>
  );
};
export default Contacts;
