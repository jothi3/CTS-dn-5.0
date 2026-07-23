import React from "react";

function BookDetails() {

    const books = [
        {
            id: 1,
            name: "React in Action",
            price: 650
        },
        {
            id: 2,
            name: "JavaScript: The Good Parts",
            price: 550
        },
        {
            id: 3,
            name: "Learning React",
            price: 700
        }
    ];

    return (
        <div>
            <h2>Book Details</h2>

            {
                books.map(book => (
                    <div key={book.id}>
                        <h4>{book.name}</h4>
                        <p>Price: ₹{book.price}</p>
                    </div>
                ))
            }

        </div>
    );
}

export default BookDetails;