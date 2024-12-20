import React, {useEffect, useState} from "react";


function Menu(props) {
    
    // Creates a useState that stores a value of 1
    const [count, setCount] = useState(1)


    // A function in which when it is active will increase count by 1
    function addCount() {
        setCount(count + 1)
    }

    // A function in which when it is active will decrease count by 1
    function subCount() {
        if(count > 1){
            setCount(count - 1)
        }
    }

    function addToCart() {
        props.AddtoCart({name: props.itemName, price: props.itemPrice, link: props.itemImage, description: props.itemDesc, count: count})
        setCount(1) // Changes value back
    }

    return (
       
        <div className="menu-structure col-12 col-lg-6 d-flex justify-content-center">
            <div className="menu-container row align-items-center">
                <div className="col-sm-7 col-6  menu-details">

                    <p className="itemName"><strong>{props.itemName}</strong></p>

                    <p className="description">{props.itemDesc}</p>

                    <p className="price">{`Price: $${props.itemPrice.toFixed(2)}`}</p>

                    <div className="cartbtns d-flex align-items-center mt-2">
                        <button onClick={addCount} className="addbtn btn btn-outline-secondary btn-sm">+</button>
                        <p id="count" className="mb-0">{count}</p>
                        <button onClick={subCount} className="subbtn btn btn-outline-secondary btn-sm">-</button>
                    </div>

                    <button className="AddtoCartbtn" onClick={addToCart}>Add to cart</button>
                </div>


                <div className="col-sm-5 col-6 menu-image d-flex justify-content-center align-items-center mt-3 mt-md-0">
                    <img src={props.itemImage} alt="" className="img-fluid rounded"/>
                </div>

            </div>
        </div>
    );
}

export default Menu;
