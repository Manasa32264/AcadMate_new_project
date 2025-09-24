import React, { useState } from 'react';
import './Register.css'

const Register = () => { // Removed onRegister prop as we now handle submission directly
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    usn: '',
    branch: '',
    section: '',
    email: '',
    phone: ''
  });

  const [error, setError] = useState({ message: '', field: '' });

  const branches = ['Biotechnology','Civil Engineering','Construction Technology and Management',
    'Computer Science and Engineering','Computer Science and Engineering(AI & ML)',
    'Computer Science and Business System','Electronics and Communication Engineering',
    'Information Science and Engineering','Mechanical Engineering','Bachelor of Computer Applications',
    'Bachelor of Business Administration','other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error.message) setError({ message: '', field: '' });
  };

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/\d/.test(password)) return 'Password must contain at least one number.';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain a special character (e.g., !@#$%).';
    return null;
  };

  // The function is now async to handle the API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ message: '', field: '' });

    // --- All your frontend validation remains the same ---
    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key) && String(formData[key]).trim() === '') {
        setError({ message: 'Please fill in all required fields.', field: key });
        return;
      }
    }
    if (!formData.usn.toUpperCase().includes('JST')) {
      setError({ message: 'Invalid USN. It must contain "JST".', field: 'usn' });
      return;
    }
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      setError({ message: 'Please provide a valid @gmail.com email address.', field: 'email' });
      return;
    }
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError({ message: passwordError, field: 'password' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError({ message: 'Passwords do not match.', field: 'confirmPassword' });
      return;
    }
    const phoneRegex = /^(91)?[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError({ message: 'Please enter a valid 10 or 12-digit phone number.', field: 'phone' });
      return;
    }
    
    // --- THIS IS THE NEW PART THAT CONNECTS TO THE BACKEND ---
    const { confirmPassword, ...submissionData } = formData;

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError({ message: result.message || 'An error occurred.', field: '' });
      } else {
        alert('Registration Successful! A confirmation email has been sent.');
        // Optional: redirect to login page after successful registration
        // window.location.href = '/login';
      }
    } catch (networkError) {
      setError({ message: 'Could not connect to the server. Please try again later.', field: '' });
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="register-box">
          <div className="register-header">
            <h1>Create Your Student Account</h1>
          </div>
          
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Create a username" required className={error.field === 'username' ? 'error-input' : ''} />
              </div>
              <div className="form-group">
                <label>USN</label>
                <input type="text" name="usn" value={formData.usn} onChange={handleChange} placeholder="e.g., 01JST21CS001" required className={error.field === 'usn' ? 'error-input' : ''} />
              </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" required 
                    title="Must contain at least 8 characters, including an uppercase, lowercase, number, and special character." className={error.field === 'password' ? 'error-input' : ''}/>
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required className={error.field === 'confirmPassword' ? 'error-input' : ''}/>
                </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Branch</label>
                <select name="branch" value={formData.branch} onChange={handleChange} required className={error.field === 'branch' ? 'error-input' : ''}>
                  <option value="">Select Branch</option>
                  {branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Section</label>
                <input type="text" name="section" value={formData.section} onChange={handleChange} placeholder="e.g., A, B, C" required className={error.field === 'section' ? 'error-input' : ''}/>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email ID</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.name@gmail.com" required className={error.field === 'email' ? 'error-input' : ''}/>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" required pattern="^(91)?[0-9]{10}$" title="Please enter a valid 10 or 12-digit number" className={error.field === 'phone' ? 'error-input' : ''}/>
              </div>
            </div>

            <button type="submit" className="register-btn">Register</button>
            {error.message && <div className="error-message">{error.message}</div>}
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

