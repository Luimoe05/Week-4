import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import SubNavbar from "../SubNavbar/SubNavbar";
import Sidebar from "../Sidebar/Sidebar";
import Home from "../Home/Home";
import ProductDetail from "../ProductDetail/ProductDetail";
import NotFound from "../NotFound/NotFound";
import {
  removeFromCart,
  addToCart,
  getQuantityOfItemInCart,
  getTotalItemsInCart,
} from "../../utils/cart";
import "./App.css";
// import { orderItem } from "../../../../student-store-api/model/prismaClient";

function App() {
  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", dorm_number: "" });
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  const [orderId, setOrderId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Toggles sidebar
  const toggleSidebar = () => setSidebarOpen((isOpen) => !isOpen);

  // Functions to change state (used for lifting state)
  const handleOnRemoveFromCart = (item) => setCart(removeFromCart(cart, item));
  const handleOnAddToCart = (item) => setCart(addToCart(cart, item));
  const handleGetItemQuantity = (item) => getQuantityOfItemInCart(cart, item);
  const handleGetTotalCartItems = () => getTotalItemsInCart(cart);

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  const handleOnCheckout = async () => {
    setIsCheckingOut(true);
    try {
      let totalPrice = 0;

      //this will hold the dorm number as a INT
      const dormNum = Number(userInfo.email);

      const newOrder = await axios.post("http://localhost:3000/orders", {
        customer_id: dormNum || 0,
        total_price: 0,
        status: "Pending",
      });

      const currOrderId = newOrder.data.order_id;
      setOrderId(currOrderId);

      console.log(currOrderId);

      for (const [stringId, quantity] of Object.entries(cart)) {
        //this will convert the stringId and cast it to a Number
        const intId = Number(stringId);

        //this finds the corresponding product
        const product = products.find((product) => product.id === intId);

        const priceWithTax =
          Number(product.price) * 0.0875 + Number(product.price);

        // this adds the current order to the total price
        totalPrice += priceWithTax * quantity;

        await axios.post(`http://localhost:3000/orderItems/${currOrderId}`, {
          product_id: intId,
          quantity: quantity,
          price: priceWithTax,
        });
      }

      // this will print the total price
      console.log(totalPrice);

      const roundedPrice = totalPrice.toFixed(2);
      console.log(roundedPrice);

      await axios.put(`http://localhost:3000/orders/${currOrderId}`, {
        status: "Completed",
        total_price: roundedPrice,
      });

      alert("Your order was submited!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsCheckingOut(false);
    }

    setCart({});
  };

  //renders the data from the db onto the front end of the website
  useEffect(() => {
    setIsFetching(true);
    const fetchOrderData = async () => {
      try {
        // gets the data from the products DB
        const { data } = await axios.get("http://localhost:3000/products");

        setProducts(data);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchOrderData();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar
          cart={cart}
          error={error}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isOpen={sidebarOpen}
          products={products}
          toggleSidebar={toggleSidebar}
          isCheckingOut={isCheckingOut}
          addToCart={handleOnAddToCart}
          removeFromCart={handleOnRemoveFromCart}
          getQuantityOfItemInCart={handleGetItemQuantity}
          getTotalItemsInCart={handleGetTotalCartItems}
          handleOnCheckout={handleOnCheckout}
          order={order}
          setOrder={setOrder}
        />
        <main>
          <SubNavbar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchInputValue={searchInputValue}
            handleOnSearchInputChange={handleOnSearchInputChange}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  error={error}
                  products={products}
                  isFetching={isFetching}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  addToCart={handleOnAddToCart}
                  searchInputValue={searchInputValue}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="/:productId"
              element={
                <ProductDetail
                  cart={cart}
                  error={error}
                  products={products}
                  addToCart={handleOnAddToCart}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            {/* {movies.map()} */}
            <Route
              path="*"
              element={
                <NotFound
                  error={error}
                  products={products}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
