import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [apiData, setApiData] = useState([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [shouldFetch, setFetchData] = useState(true);
  const [editId, setEditId] = useState(null);
  const [currentURL, setURL] = useState("...");
  const [loading, setLoading] = useState(false);
  const [ripple, setRipple] = useState({ visible: false, x:0, y:0,});
  const ref = useRef(null);


   const handleButtonClick = (e) => {
    // setRipple(false)
    const btnElement = ref.current;
    const rect = btnElement.getBoundingClientRect();
    console.log(rect)
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({visible: true, x: x - 50, y: y - 50})
    setTimeout(()=>{
      setRipple({
        ...ripple,
        visible:false,
      })
    }, 1000)
    console.log("Coordinates:", x, y);
  };

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
    setURL("https://backend-express-js-two.vercel.app/api/add-product");
    const data = {
      name,
      contact,
      email,
      address,
    };

    const url = editId
      ? `https://backend-express-js-two.vercel.app/api/update-product/${editId}`
      : "https://backend-express-js-two.vercel.app/api/add-products";
    const method = editId ? "PATCH" : "POST";
    setLoading(true);
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
        setLoading(false);
        setURL("...");
      }
    });



  };

  const deleteProduct = (id) => {
    setURL("https://backend-express-js-two.vercel.app/api/delete-product");
    fetch(
      `https://backend-express-js-two.vercel.app/api/delete-product/${id}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      if (res.ok) {
        setApiData(apiData.filter((item) => item.id !== id));
        setURL("...");
        console.log("Product deleted");
      } else {
        setURL("...");
        console.error("Failed to delete the product");
      }
    });
  };

  const handleEdit = (item) => {
    setURL("https://backend-express-js-two.vercel.app/api/update-product")
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
              {loading
                ? "loading..."
                : apiData.map((item) => (
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
                      <button onClick={() => deleteProduct(item.id)}>
                        Delete
                      </button>
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
              <button ref={ref} onClick={(event) => {addProduct(event); handleButtonClick(event);}  }>
                {editId ? "UPDATE" : "SUBMIT"}
                {ripple.visible && (<span className="rippleEffect" style={{
                      left: ripple.x,
                      top: ripple.y,
                    }}></span>)}
              </button>
            </form>

            <div>
              <p style={{ textAlign:'center',color: currentURL == "..." ? "red" : "green",
                fontSize: currentURL == "..." ? "15px" : "12px"}}>
                {currentURL == "..."
                  ? `No API is yet fetched from github.com/ArsalanTauseef`
                  : `API accessed: ${currentURL}`}
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
