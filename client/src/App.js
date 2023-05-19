import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [itemText, setItemText] = useState("");
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState("");
  const [updateItemText, setUpdateItemText] = useState("");
  const [deleted, setDeleted] = useState([]);
  const [showModal, setShowModal] = useState(false);



  const toggleCompleted = (id) => {
    const updatedItems = listItems.map((item) => {
      if (item._id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setListItems(updatedItems);
  };

  //add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5500/api/item", {
        item: itemText,
      });
      setListItems((prev) => [...prev, res.data]);
      setItemText("");
    } catch (err) {
      console.log(err);
    }
  };
  const restoreItem = async (e, itemText) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5500/api/item", {
        item: itemText,
      });
      setListItems((prev) => [...prev, res.data]);
      setItemText("");
    } catch (err) {
      console.log(err);
  }
}

  //Create function to fetch all todo items from database -- we will use useEffect hook
  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get("http://localhost:5500/api/items");
        setListItems(res.data);
        console.log("render");
      } catch (err) {
        console.log(err);
      }
    };
    getItemsList();
  }, []);

  // Delete item when click on delete
  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5500/api/item/${id}`);
      const newListItems = listItems.filter((item) => item._id !== id);
      const removedItem = listItems.find((item) => item._id === id);
      setDeleted([...deleted, removedItem]);
      setListItems(newListItems);
    } catch (err) {
      console.log(err);
    }
  };

  //Update item
  const updateItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5500/api/item/${isUpdating}`,
        { item: updateItemText }
      );
      console.log(res.data);
      const updatedItemIndex = listItems.findIndex(
        (item) => item._id === isUpdating
      );
      const updatedItem = (listItems[updatedItemIndex].item = updateItemText);
      setUpdateItemText("");
      setIsUpdating("");
    } catch (err) {
      console.log(err);
    }
  };
  //before updating item we need to show input field where we will create our updated item
  const renderUpdateForm = () => (
    <form
      className="update-form"
      onSubmit={(e) => {
        updateItem(e);
      }}
    >
      <input
        className="update-new-input"
        type="text"
        placeholder="New Item"
        onChange={(e) => {
          setUpdateItemText(e.target.value);
        }}
        value={updateItemText}
      />
      <button className="update-new-btn" type="submit">
        Update
      </button>
    </form>
  );
  return (
    <div className="App">
      <h1>Todo App</h1>
      <form className="form" onSubmit={(e) => addItem(e)}>
        <input
          type="text"
          placeholder="Add Todo Item"
          onChange={(e) => {
            setItemText(e.target.value);
          }}
          value={itemText}
        />
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems">
       {listItems.map((item) => {
          if (isUpdating === item._id) {
            return (
              <div className="todo-item" key={item._id}>
                {renderUpdateForm()}
              </div>
            )
          } else if (item.item) {
            return (
              <div
                className={`todo-item ${item.completed ? "completed-item" : ""}`}
                key={item._id}
                id="items"
              >
                <p className="item-content">{item.item}</p>
                <button 
                  id="btn_update"
                  className="update-item"
                  onClick={() => setIsUpdating(item._id)}
                >
                  Update
                </button>
                <button
                  id="btn_delete"
                  className="delete-item"
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </button>
                <button
                  id="btn_completed"
                  className="completed-button"
                  onClick={() => toggleCompleted(item._id)}
                >
                  Completed
                </button>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>

     <button className="btn_modal" onClick={() => setShowModal(true)}>Deleted items</button>

      {showModal && ( // Render modal only when showModal is true
      <div className="modal-overlay">
        <div className="modal fade show" id="modal" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">Deleted Items</div>
              <div className="modal-body">
                {deleted.map((individual) => (
                  <>
                  <p className="p_restore" key={individual._id}>{individual.item}</p>
                  <button className="btn_restore" onClick={(e) => restoreItem(e, individual.item)}>Restore</button>
                  </>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

export default App;
