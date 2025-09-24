import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { data } from './data'; // 1. Import the new central data source
import './Subjects.css'; 

const Subjects = ({ user, onLogout }) => {
  const { cycle, type } = useParams();

  // 2. Get the subject list from our imported data
  const currentCycle = data[cycle];

  const typeLabels = {
    textbook: 'Textbooks',
    notes: 'Notes',
    pyqs: 'Previous Year Questions'
  };
  const typeIcons = { textbook: '📚', notes: '📝', pyqs: '📄' };
  const typeLabel = typeLabels[type];
  const typeIcon = typeIcons[type];

  if (!currentCycle) {
    return <div>Cycle not found</div>;
  }

  return (
    <div className="subjects-page">
      {/* <header className="nav-header">
        <div className="container">
          <div className="nav-content">
            <h1 className="nav-title">Student Portal</h1>
            <div className="nav-actions">
              <span className="user-name">Hello, {user.username}</span>
              <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
              <button onClick={onLogout} className="btn btn-logout">Logout</button>
            </div>
          </div>
        </div>
      </header> */}
      <main className="subjects-main">
        <div className="container">
          <div className="page-header">
            {/* <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link> */}
            <div className="page-title">
              <span className="type-icon">{typeIcon}</span>
              <h2>{typeLabel} - {currentCycle.title}</h2>
            </div>
            <p>Select a subject to view available {type.toLowerCase()}</p>
          </div>
          <div className="subjects-grid">
            {currentCycle.subjects.map(subject => (
              // --- 3. THIS LINK IS THE ONLY PART THAT CHANGES ---
              <Link
                key={subject.id}
                // The new URL points to our PdfListPage
                to={`/pdfs/${cycle}/${type}/${subject.id}`}
                className="subject-card"
              >
                <div className="subject-icon">{subject.icon}</div>
                <h3>{subject.name}</h3>
                <div className="subject-type">
                  {typeIcon} {typeLabel}
                </div>
                <div className="arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subjects;

