import React, { useEffect, useState } from "react";
import Menu from "./components/Menuitems";
import "./style.css";
import images from "./img/Hien Dai Cafe.png";

function App() {
  // State Variables
  const [menuItems, setMenuItems] = useState([]);
  const [currentCategory, setCurrentCategory] = useState([]);
  const [showALL, setShowALL] = useState([]);
  const [changeCol, setChangeCol] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [thankYouMessage, setThankYouMessage] = useState(false); // New state for thank you message

  // Fetch menu items from API on component mount
  useEffect(() => {
    fetch(`http://localhost:4000/api/menu/`)
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
        setShowALL(data);

        // Extract unique categories
        const categories = data.map((item) => item.category);
        const uniqueCategories = ["All", ...new Set(categories)];
        setCurrentCategory(uniqueCategories);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Function to toggle the visibility of the sliding menu
  const toggleColumn = () => {
    setChangeCol((prevState) => !prevState); // Toggle state
  };

  // Close the sliding menu
  const closeMenu = () => {
    setChangeCol(false);
  };

  // Function to add items to the cart and update cart count
  const AddtoCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.name === item.name);
      if (existingItem) {
        // If item exists, update its count
        return prevItems.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, count: cartItem.count + item.count }
            : cartItem
        );
      } else {
        // If item doesn't exist, add it
        return [...prevItems, item];
      }
    });
    setCartCount((prevCount) => prevCount + item.count); // Update total cart count
  };

  // Function to clear the cart and display a thank-you message
  const clearCart = () => {
    if(cartCount > 0){
        setCartCount(0);
        setCartItems([]);
        setThankYouMessage(true);
    }
    // Set the thank you message state to true
  };

  // Function to calculate total cost of items in the cart
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.count, 0).toFixed(2);
  };

  // Function to handle category sorting
  const sortCategories = (category) => {
    if (category === "All") {
      setMenuItems(showALL); // Show all items
    } else {
      const filteredItems = showALL.filter((item) => item.category === category);
      setMenuItems(filteredItems); // Show filtered items
    }
  };

  function MenuClicked(event){
    event.preventDefault()
    setMenuItems(showALL)
    setThankYouMessage(false)
    setIsMenuHidden(false)
  }

  // Render menu items
  const menu = menuItems.map((item) => (
    <Menu
      key={item.name}
      itemName={item.name}
      itemPrice={item.price}
      itemDesc={item.description}
      itemImage={item.link}
      itemCategory={item.category}
      AddtoCart={AddtoCart}
    />
  ));

  // Render cart items
  const handleItemCountChange = (index, increment) => {
    setCartItems((prevItems) =>
      prevItems.map((cartItem, idx) =>
        idx === index
          ? { ...cartItem, count: cartItem.count + increment }
          : cartItem
      )
    );
    setCartCount((prevCount) => prevCount + increment);
  };

  const mapCart = cartItems.map((item, index) => (
    cartCount >= 1 && (
      <div key={index} className="structure col-12 d-flex justify-content-center">
        <div className="cartDisplay row align-items-center">
          {/* Image Section */}
          <div className="col-7 cartImage">
            <img src={item.link ?? 'path/to/default-image.png'} alt={item.name} />
          </div>

          {/* Details Section */}
          <div className="col-5 menu-image justify-content-center text-center align-items-center mt-3 mt-md-0">
            <p className="cartName"><strong>{item.name}</strong></p>
            <p className="cartPrice">${item.price.toFixed(2)}</p>

            {/* Increment/Decrement Buttons */}
            <div className="cartAmount d-flex align-items-center text-center">
              <button
                onClick={() => handleItemCountChange(index, 1)}
                className="btn btn-outline-secondary btn-sm">+</button>
              <p className="count">{item.count}</p>
              <button
                onClick={() => {
                  if (item.count > 1) {
                    handleItemCountChange(index, -1);
                  }
                }}
                className="btn btn-outline-secondary btn-sm">-</button>
            </div>
          </div>
        </div>
      </div>
    )
  ));

  // Render category list
  const categories = currentCategory.map((category) => (
    <li key={category} onClick={() => sortCategories(category)}>
      {category}
    </li>
  ));

  return (
    <div className="container">
      {/* Header Section: Logo, Menu, Contact, Cart */}
      <div className="row Nav">
        <div className="col-12 text-center image">
          <div className="row">
            <div className="col-3 menutag">
              <a onClick={MenuClicked} href="">Menu</a>
            </div>
            <div className="col-6 logo">
              <img src={images} alt="Logo" />
            </div>
            <div className="col-2 contacttag">
              <a href="">Contact</a>
            </div>
            <div className="col-1 cartbtn align-content-center">
              <div className="cart-container">
                <i onClick={() => {
                setIsMenuHidden(!isMenuHidden)
                setThankYouMessage(false)
                }} 
                className="fa cart-icon">
                  &#xf07a;
                </i>
                <div className="cart-count" id="cart-count">{cartCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Section */}
      {isMenuHidden && (
        <div className="row totalParent">
            {thankYouMessage && (
              <p className="thank-you-message">Thank you for purchasing!</p>
            )}
            <div className="row">
              <p className="total-cost">
                <strong>Total: ${calculateTotal()}</strong>
              </p>
              <div className="col-12">
                <button onClick={clearCart}>Purchase</button>
              </div>
            </div>
          {mapCart}
        </div>
      )}

      {/* Menu Section */}
      {!isMenuHidden && (
        <div className="row">
          <div className={`col-12 slide-menu ${changeCol ? "open" : ""}`}>
            <button className="close-btn" onClick={closeMenu}>
              &#10005;
            </button>
            <ul onClick={closeMenu}>{categories}</ul>
          </div>

          <div className={`main-content ${changeCol ? "shifted" : ""}`}>
            <div className="col-6 d-md-none">
              <button className="slidebtn" onClick={toggleColumn}>
                &#9776;
              </button>
            </div>

            <div className="d-md-12 d-flex fluid categories-L">
              {categories}
            </div>

            <div className="row">{menu}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
