import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import axios from "axios";
import { Link } from "react-router-dom";

function Course() {
  const [books, setBooks] = useState([]); // Holds the book data
  const [error, setError] = useState(null); // Handles error messages
  const [loading, setLoading] = useState(true); // Loading state


  useEffect(() => {
    const getBooks = async () => {
      try {
        const res = await axios.get("http://localhost:4001/book");
        const bookData = res.data;
        console.log(bookData);
        setBooks(bookData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books. Please try again.");
        setLoading(false);
      }
    };

    getBooks();
  }, []);

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
      <div className="mt-28 items-center justify-center text-center">
        <h1 className="text-2xl md:text-4xl">
          We're delighted to have you{" "}
          <span className="text-pink-500">Here! : </span>
        </h1>
        <p className="mt-12">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro,
          assumenda? Repellendus, iste corrupti? Tempore laudantium repellendus
          accusamus accusantium sed architecto odio, nisi expedita quas quidem
          nesciunt debitis dolore non aspernatur praesentium assumenda sint
          quibusdam, perspiciatis, explicabo sequi fugiat amet animi eos aut.
          Nobis quisquam reiciendis sunt quis sed magnam consequatur!
        </p>
        <Link to="/">
          <button className="mt-6 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-700 duration-300">
            Back
          </button>
        </Link>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4">
        {/* Show error message */}
        {error && (
          <p className="col-span-full text-red-500 text-center">{error}</p>
        )}

        {/* Show loading message */}
        {loading && (
          <p className="col-span-full text-center text-gray-500">Loading...</p>
        )}

        {/* Render books if no error and not loading */}
        {!loading &&
          !error &&
          books.map((item) => <Cards key={item.id} item={item} />)}
      </div>
    </div>
  );
}

export default Course;
