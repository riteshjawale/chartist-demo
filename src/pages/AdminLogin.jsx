import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail, verifyBeforeUpdateEmail } from 'firebase/auth';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { loginSchema } from '../validation/schemas';
import toast from 'react-hot-toast';
import './AdminLogin.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetType, setResetType] = useState('password');
  const [resetEmail, setResetEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [resetError, setResetError] = useState('');

  const verifyAdminEmail = async (email) => {
    try {
      // Query users collection for the admin with this email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email), where('role', '==', 'admin'));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('No admin account found with this email');
      }
      
      return true;
    } catch (error) {
      console.error('Admin verification error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await loginSchema.validate(credentials, { abortEarly: false });
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();

      if (!userData?.role || userData.role !== 'admin') {
        await auth.signOut();
        throw new Error('Unauthorized access. Admin privileges required.');
      }

      toast.success('Logged in as admin successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);

      if (error.name === 'ValidationError') {
        const newErrors = {};
        error.inner.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setErrors({ 
              email: 'Invalid email or password',
              password: 'Invalid email or password'
            });
            break;
          case 'auth/invalid-email':
            setErrors({ email: 'Invalid email address' });
            break;
          case 'auth/user-disabled':
            toast.error('This admin account has been disabled.');
            break;
          default:
            if (error.message === 'Unauthorized access. Admin privileges required.') {
              toast.error('This account does not have admin privileges.');
            } else {
              toast.error('Login failed. Please try again.');
            }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResetError('');

    try {
      // First verify if the email belongs to an admin
      await verifyAdminEmail(resetEmail);

      if (resetType === 'password') {
        await sendPasswordResetEmail(auth, resetEmail);
        toast.success('Password reset email sent! Please check your inbox.');
        setShowReset(false);
      } else if (resetType === 'email') {
        const userCredential = await signInWithEmailAndPassword(auth, resetEmail, credentials.password);
        
        // Double check admin status
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        const userData = userDoc.data();

        if (!userData?.role || userData.role !== 'admin') {
          throw new Error('Unauthorized access. Admin privileges required.');
        }

        await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
        toast.success('Email change verification sent! Please check your current email inbox.');
        setShowReset(false);
      }
    } catch (error) {
      console.error('Reset error:', error);
      
      if (error.message === 'No admin account found with this email') {
        setResetError('No admin account found with this email');
      } else {
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setResetError('Invalid email or password');
            break;
          case 'auth/invalid-email':
            setResetError('Invalid email address');
            break;
          case 'auth/requires-recent-login':
            toast.error('Please log in again before changing your email');
            setShowReset(false);
            break;
          case 'auth/email-already-in-use':
            setResetError('This email is already in use');
            break;
          default:
            if (error.message === 'Unauthorized access. Admin privileges required.') {
              setResetError('This account does not have admin privileges');
            } else {
              setResetError('Failed to process request. Please try again.');
            }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login">
      {!showReset ? (
        <div className="login-card">
          <h2>Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                type="email"
                id="email"
                value={credentials.email}
                onChange={(e) => {
                  setCredentials({ ...credentials, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={(e) => {
                  setCredentials({ ...credentials, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
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
            <div className="reset-options">
              <button
                type="button"
                onClick={() => {
                  setShowReset(true);
                  setResetType('password');
                }}
                className="reset-btn"
              >
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReset(true);
                  setResetType('email');
                }}
                className="reset-btn"
              >
                Change Email
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="login-card">
          <h2>{resetType === 'password' ? 'Reset Password' : 'Change Email'}</h2>
          <form onSubmit={handleReset}>
            <div className="form-group">
              <label htmlFor="resetEmail">Current Admin Email</label>
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
            </div>
            {resetType === 'email' && (
              <>
                <div className="form-group">
                  <label htmlFor="newEmail">New Email Address</label>
                  <input
                    type="email"
                    id="newEmail"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      setResetError('');
                    }}
                    className={resetError ? 'error' : ''}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Current Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={credentials.password}
                    onChange={(e) => {
                      setCredentials({ ...credentials, password: e.target.value });
                      setResetError('');
                    }}
                    className={resetError ? 'error' : ''}
                  />
                </div>
              </>
            )}
            {resetError && <div className="error-message">{resetError}</div>}
            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : resetType === 'password' ? 'Send Reset Link' : 'Send Verification Email'}
            </button>
            <button 
              type="button" 
              className="back-btn"
              onClick={() => {
                setShowReset(false);
                setResetError('');
                setResetEmail('');
                setNewEmail('');
              }}
            >
              Back to Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminLogin;