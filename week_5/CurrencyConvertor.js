import React, { Component } from "react";
class CurrencyConvertor extends Component {
    constructor() {
        super();

        this.state = {
            amount: "",
            euro: ""
        };
    }
    handleAmount = (event) => {
        this.setState({
            amount: event.target.value
        });
    }
    handleSubmit = () => {
        const euro = (this.state.amount / 90).toFixed(2);
        this.setState({
            euro: euro
        });
    }
    render() {
        return (
            <div>
                <h2 style={{ color: "green" }}>
                    Currency Convertor
                </h2>
                <p>
                    Amount :
                    <input
                        type="number"
                        onChange={this.handleAmount}
                    />
                </p>

                <button onClick={this.handleSubmit}>
                    Convert
                </button>

                <h3>Euro : {this.state.euro}</h3>

            </div>

        );

    }

}

export default CurrencyConvertor;