import React, { useState, useEffect, useCallback } from "react";
import "./ShoppingList.css";

const API_URL = "http://localhost:5000/api/shopping-list";
const CONTENT_TYPE = "application/json";

const ShoppingList = () => {
  // Use the useState hook to store the shopping list items in the component's state
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");

  // Use the useCallback hook to create a memoized version of the handleSubmit function
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      // Check if the input value is not empty
      if (item) {
        // Send the new item to the backend API using the POST method
        fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": CONTENT_TYPE,
          },
          body: JSON.stringify({ name: item }),
        })
          .then((response) => response.json())
          .then((item) => {
            // Clear the input field
            setItem("");
          })
          .catch((error) => console.error(error));
      }
    },
    [item]
  );

  // Use the useEffect hook to fetch the items from the backend API
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((items) => setItems(items))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (item === "") {
      fetch(API_URL)
        .then((response) => response.json())
        .then((items) => setItems(items))
        .catch((error) => console.error(error));
    }
  }, [item]);

const handleItemClick = useCallback((itemId) => {
  // Find the item with the given ID in the shopping list
  const index = items.findIndex((item) => item.id === itemId);

  // Check if the item was found
  if (index !== -1) {
    // Create a new array with the updated item
    const item = items[index];
    item.isBought = !item.isBought;
    const newItems = [
      ...items.slice(0, index),
      item,
      ...items.slice(index + 1),
    ];

    // Update the component's state
    setItems(newItems);

    // Send the updated item to the backend API using the PUT method
    fetch(`${API_URL}/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": CONTENT_TYPE,
      },
      body: JSON.stringify(item),
    }).catch((error) => console.error(error));
  }
}, [items, setItems]);

  return (
    <div className="shopping-list-container">
      <h1>Shopping List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={item}
          onChange={(event) => setItem(event.target.value)}
        />
        <button type="submit" disabled={!item}>
          Add
        </button>
      </form>
<ul className="shopping-list">
  {items.map((item) => (
    <li key={item.id} onClick={() => handleItemClick(item.id)}>
      {item.name}
      {item.isBought && <span/>}
    </li>
  ))}
</ul>
    </div>
  );
};

export default ShoppingList;

