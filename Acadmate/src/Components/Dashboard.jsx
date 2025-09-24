import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const cycles = [
    {
      id: 'physics',
      title: 'Physics Cycle',
      icon: '⚛️',
      subjects: ['Engineering Mathematics', 'Engineering Physics', 'Elective1- Mechanical Engineering',
         'Elements of Electrical Engineering', 'Elective2- Introduction to Programming',
         'Innovation & Design thinking'
        ],
      color: '#f4b30c'
    },
    {
      id: 'chemistry',
      title: 'Chemistry Cycle',
      icon: '⚗️',
      subjects: ['Engineering Mathematics', 'Engineering Chemistry', 'Engineering Mechanics',
         'Elective3- Electronics Engineering', 'Engineering Graphics and Design',
         'Elective3- Sustainability/Skill','Communication English'
        ],
      color: '#1a1200'
    }
  ];

  const materialTypes = [
    { id: 'syllabus', title: 'Syllabus Copy', icon: '📋', description: 'Official curriculum and course outline' },
    { id: 'textbook', title: 'Textbook', icon: '📚', description: 'Reference books and study materials' },
    { id: 'notes', title: 'Notes', icon: '📝', description: 'Lecture notes and study guides' },
    { id: 'pyqs', title: "PYQ's", icon: '📄', description: 'Previous year question papers' }
  ];

  return (
    <div className="dashboard-page">

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-header">
            <h2>Study Materials</h2>
            <p>Access all your course materials organized by semester cycles</p>
          </div>

          <div className="cycles-grid">
            {cycles.map(cycle => (
              <div key={cycle.id} className="cycle-card">
                <div className="cycle-header">
                  <div className="cycle-icon">{cycle.icon}</div>
                  <h3>{cycle.title}</h3>
                </div>

                <div className="subjects-list">
                  <h4>Subjects:</h4>
                  <div className="subjects-tags">
                    {cycle.subjects.map(subject => (
                      <span key={subject} className="subject-tag">{subject}</span>
                    ))}
                  </div>
                </div>

                <div className="materials-grid">
                  {materialTypes.map(material => {
                    let linkTo;
                    // --- THIS IS THE UPDATED NAVIGATION LOGIC ---
                    if (material.id === 'syllabus') {
                      // Syllabus link now goes directly to the viewer with a unique path
                      linkTo = `/view/syllabus/${cycle.id}/syllabus/main`;
                    } else if (material.id === 'pyqs') {
                      // PYQs link now goes directly to the PDF list page, skipping subject selection
                      linkTo = `/pdfs/${cycle.id}/pyqs/all`;
                    } else {
                      // Textbook and Notes links still go to the subject selection page
                      linkTo = `/subjects/${cycle.id}/${material.id}`;
                    }

                    return (
                      <Link
                        key={material.id}
                        to={linkTo}
                        className="material-card"
                      >
                        <div className="material-icon">{material.icon}</div>
                        <h5>{material.title}</h5>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

