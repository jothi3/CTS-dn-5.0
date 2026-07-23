import React from "react";

function GuestPage() {
  return (
    <div>
      <h2>Guest Page</h2>

      <h3>Flight Details</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Flight</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>AI101</td>
            <td>Chennai</td>
            <td>Delhi</td>
          </tr>

          <tr>
            <td>AI202</td>
            <td>Bangalore</td>
            <td>Mumbai</td>
          </tr>
        </tbody>
      </table>

      <p>Please login to book tickets.</p>
    </div>
  );
}

export default GuestPage;