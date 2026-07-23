import './App.css';
import office from './office.jfif';

function App() {

  const offices = [
    {
      Name: "DBS",
      Rent: 50000,
      Address: "Chennai"
    },
    {
      Name: "TCS",
      Rent: 70000,
      Address: "Bangalore"
    },
    {
      Name: "Infosys",
      Rent: 55000,
      Address: "Hyderabad"
    }
  ];

  return (
    <div style={{ marginLeft: "100px", marginTop: "30px" }}>
      <h1>Office Space, at Affordable Range</h1>

      {offices.map((item, index) => (
        <div key={index} style={{ marginBottom: "40px" }}>
          <img
            src={office}
            alt="Office Space"
            width="250"
            height="250"
          />

          <h2>Name: {item.Name}</h2>

          <h3
            style={{
              color: item.Rent <= 60000 ? "red" : "green"
            }}
          >
            Rent: Rs. {item.Rent}
          </h3>

          <h3>Address: {item.Address}</h3>
        </div>
      ))}
    </div>
  );
}

export default App;