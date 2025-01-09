import React, { useState, useEffect } from 'react';
import appWriteService from '../appwrite/config';
import Container from '../components/container/Container';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';
import "../styles/loader.css";
import { Link, useParams } from 'react-router-dom';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector(state => state.auth.userData);
  const profileId = useParams()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4; // Number of posts per page

  useEffect(() => {
    const fetchLikedPosts = async () => {
      setLoading(true);
      let userPostsData;
      if(profileId?.slug){
        userPostsData = await appWriteService.getUserPosts(profileId.slug);
      }else{
        userPostsData = await appWriteService.getUserPosts(userData.$id);
      }
      if (userPostsData) {
        setPosts(userPostsData.documents);
      }
      setLoading(false);
    };

    fetchLikedPosts();
  }, [userData]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <Container>
        <div className="loader-overlay">
          <div className="loader-container">
            <div className="loader"></div>
            {/* <h2 className="loading-text">Loading posts...</h2> */}
          </div>
        </div>
      </Container>
    );
  }

  if (posts.length === 0) {
    return (
      <Container>
        <div className="flex items-center justify-center h-60">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-12 w-96 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl hover:rotate-2 animate-fadeIn">
          <h1 className="text-white text-2xl font-semibold text-center">
            No posts found.
          </h1>
        </div>
      </div>


      </Container>
    );
  }

  return (
    <div className='w-full py-8'>
      <Container>
        <div className="flex flex-wrap justify-center">
          {currentPosts.map((post) => (
            <div className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4" key={post.$id}>
              <PostCard {...post} />
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <button 
              key={index + 1} 
              className={`page-button ${currentPage === index + 1 ? 'active' : ''}`} 
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </Container>

      {/* Pagination and Card Styling */}
      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          animation: fadeIn 0.5s ease-in-out;
        }

        .page-button {
          background-color: transparent;
          border: 2px solid #007bff;
          border-radius: 50px;
          color: #007bff;
          cursor: pointer;
          padding: 12px 20px;
          margin: 0 8px;
          font-weight: bold;
          font-size: 16px;
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, color 0.3s, background-color 0.4s, box-shadow 0.3s ease;
          box-shadow: 0 0 15px rgba(0, 123, 255, 0.3);
          will-change: transform, box-shadow, background-color;
        }

        .page-button:hover {
          color: white;
          background-color: rgba(0, 123, 255, 0.4);
          box-shadow: 0 0 25px rgba(0, 123, 255, 0.6);
          transform: translateY(-4px) scale(1.1);
        }

        .page-button.active {
          background: linear-gradient(45deg, #007bff, #00d4ff);
          color: white;
          box-shadow: 0 0 20px rgba(0, 123, 255, 0.8);
        }

        .fade-in {
          animation: fadeInPost 0.5s ease forwards;
        }

        @keyframes fadeInPost {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
    </div>
  );
};

export default UserPosts;
