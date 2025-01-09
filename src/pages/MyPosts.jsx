import React, { useState, useEffect } from 'react';
import appWriteService from '../appwrite/config';
import Container from '../components/container/Container';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';
import "../styles/loader.css";
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const [isAnimating, setIsAnimating] = useState(false);
  const userData = useSelector(state => state.auth.userData);
  const userInfoData = useSelector(state => state.user.userData);


  useEffect(() => {
    const fetchPosts = async () => {
      
      const queries = [
        Query.equal("$id", userInfoData.postsCreated)
      ];
      const postsData = await appWriteService.getPosts(queries);
      if (postsData) {
        setPosts(postsData);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [userData]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setIsAnimating(false);
    }, 300);
  };

  if (loading) {
    return (
      <Container>
        <div className="loader-overlay">
          <div className="loader-container">
            <div className="loader"></div>
            {/* <h2 className="loading-text">Loading your Posts...</h2> */}
          </div>
        </div>
      </Container>
    );
  }

  if (posts && posts.length === 0) {
    return (
      <div className='w-full py-8'>
        <Container>
          <div className="flex items-center justify-center h-full">
            <div className="relative bg-gray-800 text-white p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 w-full max-w-md">
              <h1 className="text-2xl text-center mb-4">
                {`Please `}
                <Link to="/add-post" className="text-blue-400 underline hover:text-blue-300">
                  Add 
                </Link>
                {` a post to publish.`}
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
              className={`p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ${isAnimating ? 'fly-away' : ''}`} 
              key={post.$id}
            >
                  <PostCard {...post} />
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
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

        <style jsx>{`
          .double-glass-background {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
            position: relative;
          }

          .glassmorphism-card {
            background-color: rgba(255, 255, 255, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            padding: 16px;
            position: relative;
            z-index: 1;
          }

          .glassmorphism-card:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
          }

          .pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  animation: fadeIn 0.5s ease-in-out;
}

.page-button {
  background-color: transparent;
  border: 2px solid #007bff;
  border-radius: 50px; /* Rounded corners for a sleek look */
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

.page-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background: rgba(0, 123, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.6s ease-out;
  z-index: 0;
}

.page-button:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

.page-button:hover {
  color: white;
  background-color: rgba(0, 123, 255, 0.4);
  box-shadow: 0 0 25px rgba(0, 123, 255, 0.6), 0 0 10px rgba(0, 123, 255, 0.6);
  transform: translateY(-4px) scale(1.1) rotate(5deg) skew(10deg, 5deg); /* Added rotation and skew */
  animation: bounce 0.5s ease-out;
}

.page-button.active {
  background: linear-gradient(45deg, #007bff, #00d4ff);
  color: white;
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.8), 0 0 15px rgba(0, 123, 255, 0.6);
  transform: scale(1.1);
  animation: pulse 1.2s infinite ease-in-out;
}

/* Pulse Animation for Active Button */
@keyframes pulse {
  0% {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(0, 123, 255, 0.8), 0 0 15px rgba(0, 123, 255, 0.6);
  }
  50% {
    transform: scale(1.2);
    box-shadow: 0 0 30px rgba(0, 123, 255, 0.8), 0 0 20px rgba(0, 123, 255, 0.7);
  }
  100% {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(0, 123, 255, 0.8), 0 0 15px rgba(0, 123, 255, 0.6);
  }
}

/* Bounce animation for hover effect */
@keyframes bounce {
  0% {
    transform: scale(1.1) translateY(0);
  }
  50% {
    transform: scale(1.1) translateY(-5px);
  }
  100% {
    transform: scale(1.1) translateY(0);
  }
}

/* Hover and active states of pagination buttons */
.page-button:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}

.page-button:active {
  transform: scale(0.98) translateY(2px);
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.8);
}


          @keyframes flyAway {
            0% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-50px) scale(0.8);
            }
          }

          .fly-away {
            animation: flyAway 0.3s forwards;
          }
        `}</style>
      </Container>
    </div>
  );
};

export default MyPosts;
