import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/posts/', {
          headers: {
            'Authorization': `Bearer ${authTokens.access}`,
          },
        });

        const data = await response.json();
        const postsArray = data.results || data;
        
        const currentUserId = jwtDecode(authTokens.access).user_id;
        const myPosts = postsArray.filter(post => post.author === currentUserId);
        setPosts(myPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authTokens) {
      fetchMyPosts();
    }
  }, [authTokens]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });

      if (response.status === 204) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-post/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2>My Blog Posts</h2>
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <p>You haven't created any blog posts yet.</p>
      ) : (
        <ul className="list-group">
          {posts.map(post => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={post.id}>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
              <div className="d-flex gap-2">
                <button
                  onClick={() => handleEdit(post.id)}
                  className="btn btn-primary btn-sm px-3 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="btn btn-danger btn-sm px-3 py-1"
                >
                  Delete
                </button>
              </div>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPosts;
