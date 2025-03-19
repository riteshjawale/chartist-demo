import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { loginSchema, resetPasswordSchema } from '../validation/schemas';
import toast from 'react-hot-toast';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    try {
      // Validate form data
      await loginSchema.validate(formData, { abortEarly: false });
      
      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);

      if (error.name === 'ValidationError') {
        // Yup validation errors
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        // Firebase errors
        switch (error.code) {
          case 'auth/invalid-credential':
            setErrors({
              email: 'Invalid email or password',
              password: 'Invalid email or password'
            });
            break;
          case 'auth/user-not-found':
            setErrors({ email: 'No account found with this email' });
            break;
          case 'auth/wrong-password':
            setErrors({ password: 'Incorrect password' });
            break;
          case 'auth/invalid-email':
            setErrors({ email: 'Invalid email address' });
            break;
          case 'auth/user-disabled':
            toast.error('This account has been disabled. Please contact support.');
            break;
          default:
            toast.error('Login failed. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResetError('');

    try {
      // Validate email
      await resetPasswordSchema.validate({ email: resetEmail });
      
      // Send reset email
      await sendPasswordResetEmail(auth, resetEmail);
      
      toast.success('Password reset email sent!');
      setShowForgotPassword(false);
    } catch (error) {
      console.error('Reset password error:', error);

      if (error.name === 'ValidationError') {
        setResetError(error.message);
      } else {
        switch (error.code) {
          case 'auth/user-not-found':
            setResetError('No account found with this email');
            break;
          case 'auth/invalid-email':
            setResetError('Invalid email address');
            break;
          case 'auth/invalid-credential':
            setResetError('Invalid email address');
            break;
          default:
            setResetError('Failed to send reset email. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {!showForgotPassword ? (
        <div className="login-card">
          <h2>Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="auth-links">
            <button 
              onClick={() => setShowForgotPassword(true)}
              className="forgot-password-link"
            >
              Forgot Password?
            </button>
            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="login-card">
          <h2>Reset Password</h2>
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="resetEmail">Email</label>
              <input
                type="email"
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setResetError('');
                }}
                className={resetError ? 'error' : ''}
              />
              {resetError && <span className="error-message">{resetError}</span>}
            </div>
            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Reset Password'}
            </button>
            <button 
              type="button" 
              className="back-btn"
              onClick={() => setShowForgotPassword(false)}
            >
              Back to Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;