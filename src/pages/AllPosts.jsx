import React, { useState, useEffect } from 'react';
import appWriteService from '../appwrite/config';
import Container from '../components/container/Container';
import PostCard from '../components/PostCard';
import '../styles/loader.css';
import { useSelector } from 'react-redux';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const authStatus = useSelector((state) => state.auth.status);
  const postsPerPage = 4;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      if (authStatus) {
        try {
          const postsData = await appWriteService.getPosts([]);
          if (postsData) {
            setPosts(postsData);
          }
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
      setLoading(false);
      window.scrollTo(0,0)
    };
  
    fetchPosts();
  }, [authStatus]);

  // Only calculate pagination if posts have been fetched
  let currentPosts = [];
  let totalPages = 0;
  if (posts && posts.length > 0) {
    // Calculate the current posts to display
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    totalPages = Math.ceil(posts.length / postsPerPage);
  }

  const handlePageChange = (pageNumber) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setIsAnimating(false);
    }, 300);
    window.scrollTo(0,0)
  };

  // Create an array of page numbers to display, limited to 5 for example
  const visiblePages = [];
  const maxPages = 5;
  let startPage = Math.max(currentPage - Math.floor(maxPages / 2), 1);
  let endPage = startPage + maxPages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxPages + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  if (loading) {
    return (
      <Container>
        <div className="loader-overlay">
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        </div>
      </Container>
    );
  }

  if (posts && posts.length === 0) {
    return (
      <div className='w-full py-8'>
        <Container>
          <div className="flex items-center justify-center h-60">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-12 w-96 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl hover:rotate-2 animate-fadeIn">
              <h1 className="text-white text-2xl font-semibold text-center">
                Write some blogs to have your post published.
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className='w-full py-8'>
      <Container>
        <div className="flex flex-wrap justify-center">
          {currentPosts.map((post) => (
            <div
              className={`p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ${isAnimating ? 'fly-away' : 'fade-in'}`} 
              key={post.$id}
            >
              <PostCard {...post} />
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="pagination">
          {currentPage > 1 && (
            <button 
              className="page-button" 
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </button>
          )}
          
          {visiblePages.map((page) => (
            <button 
              key={page} 
              className={`page-button ${currentPage === page ? 'active' : ''}`} 
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          
          {currentPage < totalPages && (
            <button 
              className="page-button" 
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          )}
        </div>

        <style jsx>{`
          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            flex-wrap: wrap; /* Allow pagination to wrap on smaller screens */
            gap: 8px;
            animation: fadeIn 0.5s ease-in-out;
          }

          .page-button {
            background-color: transparent;
            border: 2px solid #007bff;
            border-radius: 50px;
            color: #007bff;
            cursor: pointer;
            padding: 10px 16px;
            font-weight: bold;
            font-size: 14px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .page-button:hover {
            background-color: #007bff;
            color: white;
            box-shadow: 0 0 8px rgba(0, 123, 255, 0.6);
          }

          .page-button.active {
            background-color: #00bfff;
            color: white;
            box-shadow: 0 0 12px rgba(0, 191, 255, 0.7);
          }

          .page-button:focus {
            outline: none;
          }

          .page-button:active {
            transform: scale(0.98);
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </Container>
    </div>
  );
};

export default AllPosts;
