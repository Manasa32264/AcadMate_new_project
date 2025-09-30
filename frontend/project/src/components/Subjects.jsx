import React from 'react';
import { data } from './data'; // 1. Import the new central data source
import './Subjects.css'; 

const Subjects = ({ user, onLogout, cycle, type, onNavigate, onBack }) => {

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
              <button
                key={subject.id}
                onClick={() => onNavigate('pdfList', { 
                  cycle: cycle, 
                  type: type, 
                  subjectId: subject.id 
                })}
                className="subject-card"
              >
                <div className="subject-icon">{subject.icon}</div>
                <h3>{subject.name}</h3>
                <div className="subject-type">
                  {typeIcon} {typeLabel}
                </div>
                <div className="arrow">→</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subjects;
