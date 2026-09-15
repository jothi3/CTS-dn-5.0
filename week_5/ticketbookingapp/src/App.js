import React from "react";
import BookDetails from "./components/BookDetails";
import BlogDetails from "./components/BlogDetails";
import CourseDetails from "./components/CourseDetails";

function App() {
  const showBooks = true;
  const showBlogs = false;
  const showCourses = true;

  let blogComponent;

  if (showBlogs) {
    blogComponent = <BlogDetails />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Blogger Application</h1>

      {blogComponent}

      <hr />

      {showBooks && <BookDetails />}

      <hr />

      {showCourses ? <CourseDetails /> : <h3>No Course Available</h3>}
    </div>
  );
}

export default App;