import React, { useState } from 'react';
import './Registration.css'
// The onRegister prop is a function that would handle the registration logic,
// for example, sending the data to a server.
const Registration = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  // --- Password Validation Helper Function ---
  const validatePassword = (password) => {
    // Rule: At least 8 characters
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    // Rule: Contains at least one number
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number.';
    }
    // Rule: Contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter.';
    }
    // Rule: Contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    // Rule: Contains at least one special character
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain a special character (e.g., !@#$%).';
    }
    // If all rules pass, return null (no error)
    return null;
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error message when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // 1. Check for empty fields
    if (!formData.username.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    
    // 2. Validate Password Strength
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
        setError(passwordError);
        return;
    }

    // 3. Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    // If all validation passes, call the onRegister prop
    onRegister({ username: formData.username, password: formData.password });
    alert('Registration successful!'); // Placeholder for success feedback
  };

  return (
    <>
      <div className="registration-container">
        <div className="registration-box">
          <div className="registration-header">
            <h1>Create Account</h1>
          </div>
          
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username" type="text" name="username"
                value={formData.username} onChange={handleChange}
                placeholder="Enter a username" required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password" type="password" name="password"
                value={formData.password} onChange={handleChange}
                placeholder="Create a strong password"
                // This pattern provides instant browser-side validation feedback
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}"
                title="Password must be at least 8 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword" type="password" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange}
                placeholder="Confirm your password" required
              />
            </div>

            <button type="submit" className="registration-btn">Register</button>
            
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      </div>
    </>
  );
};

export default Registration;

