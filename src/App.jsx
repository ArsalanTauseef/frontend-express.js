import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [apiData, setApiData] = useState([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [shouldFetch, setFetchData] = useState(true);
  const [editId, setEditId] = useState(null); // State to track the id of the product being edited

  const fetchData = () => {
    fetch("https://backend-express-js-two.vercel.app/api/my-products")
      .then((res) => res.json())
      .then((data) => {
        setApiData(data);
        console.log("Data is available", data);
      });
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setFetchData(false);
    }
  }, [shouldFetch]);

  const addProduct = (event) => {
    event.preventDefault();

    const data = {
      name,
      contact,
      email,
      address,
    };

    const url = editId
      ? `https://backend-express-js-two.vercel.app/api/update-product/${editId}`
      : "https://backend-express-js-two.vercel.app/api/add-products";
    const method = editId ? "PATCH" : "POST"; // Use PATCH for update and POST for add

    fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((result) => {
      if (result.ok) {
        setFetchData(true);
        setName("");
        setContact("");
        setEmail("");
        setAddress("");
        setEditId(null); // Reset editId after successful operation
      }
    });
  };

  const deleteProduct = (id) => {
    fetch(
      `https://backend-express-js-two.vercel.app/api/delete-product/${id}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      if (res.ok) {
        setApiData(apiData.filter((item) => item.id !== id));
        console.log("Product deleted");
      } else {
        console.error("Failed to delete the product");
      }
    });
  };

  const handleEdit = (item) => {
    setName(item.name);
    setContact(item.contact);
    setEmail(item.email);
    setAddress(item.address);
    setEditId(item.id);
  };

  return (
    <>
      <div className="wrapper">
        <header>
          <h1>A Project created using Express.js & React.js by...</h1>
          <p style={{ fontFamily: "Bradley Hand, cursive" }}>
            - Arsalan Tauseef
          </p>
        </header>
        <main className="main-div">
          <div className="left">
            <h1>DATA</h1>
            <div className="left-div-2">
              {apiData.map((item) => (
                <div className="leftData" key={item.id}>
                  <div>
                    <h5>ID: </h5>
                    <p>{item.id}</p>
                  </div>
                  <div>
                    <h5>Name: </h5>
                    <p>{item.name}</p>
                  </div>
                  <div>
                    <h5>Contact: </h5>
                    <p>{item.contact}</p>
                  </div>
                  <div>
                    <h5>Email: </h5>
                    <p>{item.email}</p>
                  </div>
                  <div>
                    <h5>Address: </h5>
                    <p>{item.address}</p>
                  </div>
                  <button onClick={() => deleteProduct(item.id)}>Delete</button>
                  <button onClick={() => handleEdit(item)}>Edit</button>{" "}
                  {/* Add an edit button */}
                </div>
              ))}
            </div>
          </div>
          <div className="right">
            <h1>FORM</h1>
            <form>
              <div>
                <label>Name: </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label>Contact: </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div>
                <label>Email: </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label>Address: </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <button onClick={(event) => addProduct(event)}>
                {editId ? "UPDATE" : "SUBMIT"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
