import React from "react";
import Post from "./Post";

class Posts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            posts: []
        };
    }

    loadPosts() {
        fetch("https://jsonplaceholder.typicode.com/posts")
            .then(response => response.json())
            .then(data => {

                const posts = data.map(
                    p => new Post(p.id, p.title, p.body)
                );

                this.setState({
                    posts: posts
                });

            });
    }

    componentDidMount() {
        this.loadPosts();
    }

    render() {
        return (
            <div>
                <h1>Posts</h1>

                {
                    this.state.posts.map(post => (
                        <div key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.body}</p>
                            <hr />
                        </div>
                    ))
                }

            </div>
        );
    }

    componentDidCatch(error, info) {
        alert(error);
    }
}

export default Posts;