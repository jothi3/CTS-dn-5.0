import React from "react";

function BlogDetails() {

    const blogs = [
        {
            id: 1,
            title: "React Basics",
            author: "John"
        },
        {
            id: 2,
            title: "Conditional Rendering",
            author: "David"
        },
        {
            id: 3,
            title: "React Hooks",
            author: "Smith"
        }
    ];

    return (
        <div>
            <h2>Blog Details</h2>

            {
                blogs.map(blog => (
                    <div key={blog.id}>
                        <h4>{blog.title}</h4>
                        <p>Author : {blog.author}</p>
                    </div>
                ))
            }

        </div>
    );
}

export default BlogDetails;