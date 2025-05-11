import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Auth.css';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Load saved credentials when component mounts
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    
    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword
      });
      setRememberMe(true);
    }
  }, []);

  // Mock user data - in a real app, this would come from a backend
  const mockUsers = [
    { email: 'test@example.com', password: 'password123' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
  };

  const handleRememberMe = (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    
    if (!isChecked) {
      // Remove saved credentials when unchecking remember me
      localStorage.removeItem('savedEmail');
      localStorage.removeItem('savedPassword');
      setFormData(prev => ({
        ...prev,
        password: '' // Clear password field when unchecking remember me
      }));
    } else {
      // Save current credentials when checking remember me
      localStorage.setItem('savedEmail', formData.email);
      localStorage.setItem('savedPassword', formData.password);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Check if user exists and password matches
    const user = mockUsers.find(u => u.email === formData.email);
    if (!user || user.password !== formData.password) {
      setError('Invalid email or password');
      return;
    }

    // Save credentials if remember me is checked
    if (rememberMe) {
      localStorage.setItem('savedEmail', formData.email);
      localStorage.setItem('savedPassword', formData.password);
    }

    // If validation passes, navigate to home page
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={error ? 'error-input' : ''}
            />
          </div>
          <div className="form-group relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className={error ? 'error-input' : ''}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="eye-icon" />
              ) : (
                <FaEye className="eye-icon" />
              )}
            </button>
          </div>
          <div className="remember-me">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMe}
              />
              Remember me
            </label>
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn; 