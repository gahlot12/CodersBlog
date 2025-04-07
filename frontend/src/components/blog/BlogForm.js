import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getPost, createPost, updatePost } from '../../services/api';

const BlogPostSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters')
    .required('Title is required'),
  content: Yup.string()
    .min(20, 'Content must be at least 20 characters')
    .required('Content is required'),
});

const BlogForm = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (isEditing && id) {
        try {
          setLoading(true);
          const response = await getPost(id);
          setPost(response.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch blog post for editing');
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [isEditing, id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditing) {
        await updatePost(id, values);
        navigate(`/posts/${id}`);
      } else {
        const response = await createPost(values);
        navigate(`/posts/${response.data.id}`);
      }
    } catch (err) {
      setError(isEditing ? 'Failed to update post' : 'Failed to create post');
      setSubmitting(false);
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

  // If we're editing and the post wasn't found
  if (isEditing && !post) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Blog post not found
        </div>
      </div>
    );
  }

  const initialValues = isEditing
    ? { title: post.title, content: post.content }
    : { title: '', content: '' };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h2>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
        </div>
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={BlogPostSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, touched, errors }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <Field 
                    type="text" 
                    name="title" 
                    className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`} 
                    placeholder="Enter blog post title" 
                  />
                  <ErrorMessage name="title" component="div" className="invalid-feedback" />
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">Content</label>
                  <Field 
                    as="textarea" 
                    name="content" 
                    className={`form-control ${touched.content && errors.content ? 'is-invalid' : ''}`} 
                    placeholder="Write your blog content here..." 
                    rows="10" 
                  />
                  <ErrorMessage name="content" component="div" className="invalid-feedback" />
                </div>

                <div className="d-flex justify-content-between">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;