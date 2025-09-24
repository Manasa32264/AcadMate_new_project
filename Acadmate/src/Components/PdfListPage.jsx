

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { data } from './data';
import './PdfListPage.css';

const PdfListPage = ({ user, onLogout }) => {
  const { cycle, type, subjectId } = useParams();

  const currentCycleData = data[cycle];
  const typeLabels = {
    textbook: 'Textbooks',
    notes: 'Notes',
    pyqs: 'Previous Year Questions'
  };

  

  let pdfs = [];
  let pageTitle = '';
  let backLink = '';

  if (subjectId === 'all' && type === 'pyqs') {
    // Case 1: We are showing all PYQs for an entire cycle
    pageTitle = `${currentCycleData.title} - ${typeLabels.pyqs}`;
    backLink = '/dashboard';

    // Use flatMap to collect all PYQs from all subjects in this cycle
    pdfs = currentCycleData.subjects.flatMap(subject => 
      subject.pyqs.map(pyq => ({
        ...pyq,
        // Prepend the subject name to the title for clarity
        title: `${subject.name} - ${pyq.title}`,
        // Create the correct, unique link for the viewer
        link: `/view/${cycle}/${subject.id}/${type}/${pyq.id}`
      }))
    );
  } else {
    // Case 2: We are showing materials for a single subject (the original logic)
    const currentSubject = currentCycleData?.subjects.find(s => s.id === subjectId);
    if (currentSubject) {
      pageTitle = `${typeLabels[type]} for ${currentSubject.name}`;
      backLink = `/subjects/${cycle}/${type}`;
      
      // Get the PDFs and add the 'link' property for consistency
      pdfs = (currentSubject[type] || []).map(pdf => ({
        ...pdf,
        link: `/view/${cycle}/${subjectId}/${type}/${pdf.id}`
      }));
    }
  }

  return (
    <div className="pdf-list-page">
      {/* <header className="nav-header">
        <div className="container">
            <h1 className="nav-title">Student Portal</h1>
            <div className="nav-actions">
              <span className="user-name">Hello, {user.username}</span>
              <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
              <button onClick={onLogout} className="btn btn-logout">Logout</button>
            </div>
        </div>
      </header> */}
      <main className="pdf-list-main">
        <div className="container">
          <div className="page-header">
            {/* <Link to={backLink} className="back-btn">← Back</Link> */}
            <h2>{pageTitle}</h2>
            <p>Select a document to view.</p>
          </div>
          <div className="pdf-list">
            {pdfs.length > 0 ? (
              pdfs.map(pdf => (
                <Link key={pdf.link} to={pdf.link} className="pdf-list-item">
                  <span className="pdf-icon">📄</span>
                  <span className="pdf-title">{pdf.title}</span>
                  <span className="arrow">→</span>
                </Link>
              ))
            ) : (
              <p className="no-pdfs">No documents available for this category yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PdfListPage;


