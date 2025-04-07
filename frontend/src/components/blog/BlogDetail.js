import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getPost(id);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blog post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsDeleting(true);
        await deletePost(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete post');
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Blog post not found
        </div>
      </div>
    );
  }

  const isAuthor = user && user.user_id === post.author;

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title mb-3">{post.title}</h1>
          
          <div className="d-flex justify-content-between mb-4">
            <h6 className="card-subtitle text-muted">
              By {post.author_username} • {new Date(post.created_at).toLocaleDateString()}
            </h6>
            
            {isAuthor && (
              <div className="btn-group">
                <Link to={`/edit-post/${post.id}`} className="btn btn-sm btn-outline-secondary">
                  Edit
                </Link>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
          
          <div className="card-text">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <Link to="/" className="btn btn-primary mt-3">
            Back to Blog List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;