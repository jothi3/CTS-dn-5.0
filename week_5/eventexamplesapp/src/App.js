import React, { useState } from "react";
import "./App.css";
import CurrencyConverter from "./CurrencyConverter";

function App() {
  const [count, setCount] = useState(5);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const sayHello = () => {
    alert("Hello! Member1");
  };

  const sayWelcome = (msg) => {
    alert(msg);
  };

  const handleClick = () => {
    alert("I was clicked");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{count}</h2>

      <button
        onClick={() => {
          increment();
          sayHello();
        }}
      >
        Increment
      </button>

      <br />
      <br />

      <button onClick={decrement}>Decrement</button>

      <br />
      <br />

      <button onClick={() => sayWelcome("Welcome")}>
        Say Welcome
      </button>

      <br />
      <br />

      <button onClick={handleClick}>
        Click on me
      </button>

      <hr />

      <CurrencyConverter />
    </div>
  );
}

export default App;