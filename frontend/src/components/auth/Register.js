import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const result = await registerUser(values.username, values.email, values.password);
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
    }
    
    setSubmitting(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Register</div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <Formik
                initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username</label>
                      <Field 
                        type="text" 
                        name="username" 
                        className="form-control" 
                        placeholder="Choose a username" 
                      />
                      <ErrorMessage name="username" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <Field 
                        type="email" 
                        name="email" 
                        className="form-control" 
                        placeholder="Enter your email" 
                      />
                      <ErrorMessage name="email" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Field 
                        type="password" 
                        name="password" 
                        className="form-control" 
                        placeholder="Create a password" 
                      />
                      <ErrorMessage name="password" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <Field 
                        type="password" 
                        name="confirmPassword" 
                        className="form-control" 
                        placeholder="Confirm your password" 
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                  </Form>
                )}
              </Formik>

              <div className="mt-3">
                Already have an account? <Link to="/login">Login here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;