/*
 * In the client side application below is a Pagination feature. The expected behaviour is a click of either the "Previous" or "Next" button in the "Pagination" components will fetch a new set of posts from the database.

  * The behaviour exhibited is such that the page remains unchanged when either the "Previous" or "Next" button is clicked.

  * NOTE: The API already has a set limit to the number of posts to be returned
 */

import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const pageNum = localStorage.getItem("page");

  let [page, setPage] = useState(pageNum || 1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    if (page < 1) {
      setPage(1);
    }
    fetchPosts(page);
  }, []);

  const fetchPosts = (page) => {
    axios
      .get(`/api/v1/posts/${page}`)
      .then((resp) => {
        const { pages: totalPages } = resp.data;
        setPages(totalPages);
      })
      .catch((err) => {
        console.error("An unexpected error occurred", err);
      });
  };

  return (
    <>
      <Pagination page={page} pages={pages} setPage={setPage} />
    </>
  );
}

const Pagination = (props) => {
  const { page, pages, setPage } = props;

  let middlePaginationList;

  if (pages <= 5) {
    middlePaginationList = [...Array(pages)].map((_, index) => (
      <button
        key={index + 1}
        className={`${
          page === index + 1
            ? "text-blue-700 rounded-full bg-white p-1 font-bold cursor-pointer mx-2"
            : "text-white font-bold cursor-pointer p-1"
        }`}
        onClick={() => setPage(index + 1)}
        disabled={page === index + 1}
      >
        {index + 1}
      </button>
    ));
  }

  return (
    pages > 1 && (
      <div>
        <button
          className="text-red-700 cursor-pointer p-1 mr-1"
          onClick={() => setPage(Number(page) - 1)}
          disabled={page === 1 ? true : false}
        >
          Previous
        </button>
        {middlePaginationList}
        <button
          className="text-red-700 cursor-pointer p-1 mr-1"
          onClick={() => setPage(Number(page) + 1)}
          disabled={page === pages ? true : false}
        >
          Next
        </button>
      </div>
    )
  );
};

export default App;

/*
============================================
  API code for the page post call
============================================

  const getAllPosts = async (req, res) => {
    try {
      let query = Posts.find();
      
      const page = parseInt(req.params.page !== null ? req.params.page : 1);
      const pageLimit = 10;
      const skip = (page - 1) * pageLimit;
      const total = await Posts.countDocuments();
      
      const pages = Math.ceil(total / pageLimit);
      
      query = query.skip(skip).limit(pageLimit);
      if (page > pages) {
        return res.status(404).json({ msg: "Failed" });
      }
      const posts = await query.sort({$natural: -1});

      res
        .status(200)
        .json({ msg: "Success", posts, nbHits: posts.length, page, pages });
    } catch (error) {
      res.status(404).json({ msg: "Failed" });
    }
  };
*/
