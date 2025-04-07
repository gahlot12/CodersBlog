import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../../services/api';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getPosts(currentPage);
        setPosts(response.data.results);
        
        // Calculate total pages
        const count = response.data.count;
        const pageSize = 10; // Match Django's PAGE_SIZE
        setTotalPages(Math.ceil(count / pageSize));
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blog posts');
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
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

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col d-flex justify-content-between align-items-center">
          <h1>Blog Posts</h1>
          <Link to="/create-post" className="btn btn-primary">
            Create New Post
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="alert alert-info">No blog posts available</div>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-6 mb-4" key={post.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    By {post.author_username} • {new Date(post.created_at).toLocaleDateString()}
                  </h6>
                  <p className="card-text">
                    {post.content.length > 150
                      ? `${post.content.substring(0, 150)}...`
                      : post.content}
                  </p>
                  <Link to={`/posts/${post.id}`} className="btn btn-sm btn-outline-primary">
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Blog pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default BlogList;