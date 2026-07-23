function BlogDetails() {
    const blogs = [
        {
            id: 1,
            title: "React Basics",
            author: "John"
        },
        {
            id: 2,
            title: "Learning JSX",
            author: "David"
        }
    ];
    return (
        <div>
            <h2>Blog Details</h2>
            <ul>
                {blogs.map(blog => (
                    <li key={blog.id}>
                        {blog.title} - {blog.author}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BlogDetails;