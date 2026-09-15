import React from "react";

function CurrencyConverter() {
  return (
    <div>
      <h2 style={{ color: "green" }}>Currency Converter!!!</h2>

      <div>
        <label>Amount: </label>
        <input type="number" />
      </div>

      <br />

      <div>
        <label>Currency: </label>
        <input type="text" value="Euro" readOnly />
      </div>

      <br />

      <button>Submit</button>
    </div>
  );
}

export default CurrencyConverter;