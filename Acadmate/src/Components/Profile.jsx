import React from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = ({ user, onLogout }) => {
  return (
    <div className="profile-page">
      <main className="profile-main">
        <div className="container">
          <div className="profile-container">
            <div className="profile-header">
              <div className="avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              {/* --- THIS IS THE CHANGE --- */}
              <h2>{user.username}</h2>
            </div>

            <div className="profile-grid">
              <div className="profile-card">
                <h3>Personal Information</h3>
                <div className="profile-info">
                  <div className="info-item">
                    <label>Username:</label>
                    <span>{user.username}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{user.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h3>Academic Details</h3>
                <div className="profile-info">
                  <div className="info-item">
                    <label>USN:</label>
                    <span>{user.usn}</span>
                  </div>
                  <div className="info-item">
                    <label>Branch:</label>
                    <span>{user.branch}</span>
                  </div>
                  <div className="info-item">
                    <label>Section:</label>
                    <span>{user.section}</span>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

