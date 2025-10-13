/**
 * Attendify - Attendance Tracking Component
 */

import React, { useState, useEffect } from 'react';
import './AttendanceTracker.css';

const AttendanceTracker = ({ onBack }) => {
  // CSS moved to AttendanceTracker.css file

  const [timetable, setTimetable] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [targetAttendance, setTargetAttendance] = useState(75);
  const [manualSubject, setManualSubject] = useState('');
  const [showTimetable, setShowTimetable] = useState(true);
  const [showExtraOptions, setShowExtraOptions] = useState({});
  const [selectedDates, setSelectedDates] = useState({});
  const [actionHistory, setActionHistory] = useState([]);
  const [showUndo, setShowUndo] = useState(false);
  const [extraShowMore, setExtraShowMore] = useState({});
  const [scheduledShowMore, setScheduledShowMore] = useState({}); // New state for scheduled class show more
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedSubjectForCalendar, setSelectedSubjectForCalendar] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedTimetable = localStorage.getItem('timetable');
    const savedSessions = localStorage.getItem('sessions');
    const savedTarget = localStorage.getItem('targetAttendance');
    const savedSelectedDates = localStorage.getItem('selectedDates');
    const savedActionHistory = localStorage.getItem('actionHistory');

    if (savedTimetable) setTimetable(JSON.parse(savedTimetable));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedTarget) setTargetAttendance(parseInt(savedTarget));
    if (savedSelectedDates) setSelectedDates(JSON.parse(savedSelectedDates));
    if (savedActionHistory) setActionHistory(JSON.parse(savedActionHistory));
  }, []);

  // Save to localStorage
  useEffect(() => localStorage.setItem('timetable', JSON.stringify(timetable)), [timetable]);
  useEffect(() => localStorage.setItem('sessions', JSON.stringify(sessions)), [sessions]);
  useEffect(() => localStorage.setItem('targetAttendance', targetAttendance.toString()), [targetAttendance]);
  useEffect(() => localStorage.setItem('selectedDates', JSON.stringify(selectedDates)), [selectedDates]);
  useEffect(() => localStorage.setItem('actionHistory', JSON.stringify(actionHistory)), [actionHistory]);

  const addManualEntry = () => {
    if (!manualSubject.trim()) return alert('Please enter subject name.');
    const existingEntry = timetable.some(t => t.subject.toLowerCase() === manualSubject.trim().toLowerCase());
    if (existingEntry) return alert('Subject already exists');

    const newEntry = { day: 'General', subject: manualSubject.trim() };
    setTimetable(prev => [...prev, newEntry]);

    const today = new Date().toISOString().split('T')[0];
    setSelectedDates(prev => ({ ...prev, [manualSubject.trim()]: today }));

    setManualSubject('');
    setShowTimetable(true);
  };

  const handleKeyPress = e => { if (e.key === 'Enter') addManualEntry(); };
  const removeTimetableEntry = (day, subject) => setTimetable(timetable.filter(t => !(t.day === day && t.subject === subject)));

  const addToHistory = (action, sessionData) => {
    const historyEntry = { id: Date.now(), action, sessionData, timestamp: new Date().toISOString() };
    setActionHistory(prev => [historyEntry, ...prev].slice(0, 10));
    setShowUndo(true);
    setTimeout(() => setShowUndo(false), 5000);
  };

  const undoLastAction = () => {
    if (!actionHistory.length) return;
    const lastAction = actionHistory[0];
    const { action, sessionData } = lastAction;

    if (action === 'add_session') setSessions(prev => prev.filter(s => s.id !== sessionData.id));
    else if (action === 'mark_attendance')
      setSessions(prev => prev.map(s => s.id === sessionData.id ? { ...s, attendance: sessionData.previousAttendance } : s));

    setActionHistory(prev => prev.slice(1));
    setShowUndo(false);
  };

  const markAttendance = (subject, date, status, sessionType = 'scheduled') => {
    if (sessionType === 'extra') {
      const newSession = { id: Date.now() + Math.random(), subject, date, status: sessionType, attendance: status, timestamp: new Date().toISOString() };
      setSessions(prev => [...prev, newSession]);
      addToHistory('add_session', newSession);
      return;
    }

    let sessionExists = sessions.find(s => s.subject === subject && s.date === date && s.status === sessionType);
    if (!sessionExists) {
      const newSession = { id: Date.now() + Math.random(), subject, date, status: sessionType, attendance: status, timestamp: new Date().toISOString() };
      setSessions(prev => [...prev, newSession]);
      addToHistory('add_session', newSession);
      return;
    }

    const previousAttendance = sessionExists.attendance;
    setSessions(prev => prev.map(s => s.id === sessionExists.id ? { ...s, attendance: status } : s));
    addToHistory('mark_attendance', { id: sessionExists.id, subject, date, status: sessionType, previousAttendance, newAttendance: status });
  };

  const calcStats = subject => {
    const scheduledSessions = sessions.filter(s => s.subject === subject && s.status === 'scheduled');
    const extraSessions = sessions.filter(s => s.subject === subject && s.status === 'extra');

    const totalScheduled = scheduledSessions.length;
    const attendedScheduled = scheduledSessions.filter(s => s.attendance === 'present').length;
    const totalExtra = extraSessions.length;
    const attendedExtra = extraSessions.filter(s => s.attendance === 'present').length;
    const totalClasses = totalScheduled + totalExtra;
    const totalAttended = attendedScheduled + attendedExtra;
    const totalAbsent = (totalScheduled - attendedScheduled) + (totalExtra - attendedExtra);

    if (totalClasses === 0) return { percentage: 0, attended: 0, total: 0, absent: 0, extra: totalExtra, extraAttended: attendedExtra, extraAbsent: totalExtra - attendedExtra, effectiveTotal: 0, classesNeeded: 0 };

    const percentage = (totalAttended / totalClasses) * 100;
    const classesNeeded = percentage < targetAttendance ? Math.ceil((targetAttendance * totalClasses - 100 * totalAttended) / (100 - targetAttendance)) : 0;

    return { percentage, attended: totalAttended, total: totalClasses, absent: totalAbsent, extra: totalExtra, extraAttended: attendedExtra, extraAbsent: totalExtra - attendedExtra, effectiveTotal: totalClasses, classesNeeded };
  };

  const subjects = [...new Set(timetable.map(t => t.subject))];

  // Calendar functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getAttendanceStatus = (date, subject) => {
    if (!subject) return null;
    const dateStr = new Date(currentYear, currentMonth, date).toISOString().split('T')[0];
    const session = sessions.find(s => s.subject === subject && s.date === dateStr);
    return session ? session.attendance : null;
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const attendanceStatus = getAttendanceStatus(day, selectedSubjectForCalendar);
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentMonth && 
                     new Date().getFullYear() === currentYear;
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${attendanceStatus ? attendanceStatus : ''} ${isToday ? 'today' : ''}`}
          title={attendanceStatus ? `${attendanceStatus.charAt(0).toUpperCase() + attendanceStatus.slice(1)} on ${day}` : `No attendance marked for ${day}`}
        >
          <span className="day-number">{day}</span>
          {attendanceStatus && (
            <div className={`attendance-indicator ${attendanceStatus}`}>
              {attendanceStatus === 'present' ? '✓' : '✗'}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="calendar-nav-btn" onClick={() => navigateMonth('prev')}>‹</button>
          <h3 className="calendar-title">{monthNames[currentMonth]} {currentYear}</h3>
          <button className="calendar-nav-btn" onClick={() => navigateMonth('next')}>›</button>
        </div>
        
        <div className="calendar-weekdays">
          <div className="weekday">Sun</div>
          <div className="weekday">Mon</div>
          <div className="weekday">Tue</div>
          <div className="weekday">Wed</div>
          <div className="weekday">Thu</div>
          <div className="weekday">Fri</div>
          <div className="weekday">Sat</div>
        </div>
        
        <div className="calendar-grid">
          {days}
        </div>
        
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color present"></div>
            <span>Present</span>
          </div>
          <div className="legend-item">
            <div className="legend-color absent"></div>
            <span>Absent</span>
          </div>
          <div className="legend-item">
            <div className="legend-color today"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="attendance-container">
      <button className="back-arrow-btn" onClick={onBack} title="Go Back">
        ←
      </button>
      
      <h2 className="attendance-title">📋 Attendance Tracker</h2>
      {showUndo && <button className="btn undo-btn" onClick={undoLastAction}>↶ Undo Last Action</button>}

      <div className="upload-section">
        <h3>Target Attendance Percentage</h3>
        <div className="target-input">
          <input type="number" min="0" max="100" value={targetAttendance} onChange={e => setTargetAttendance(parseInt(e.target.value) || 75)} className="target-slider"/>
          <span className="target-label">%</span>
        </div>

        <h3>Enter All Your Subjects</h3>
        <div className="manual-input">
          <input type="text" placeholder="Type subject name and press Enter to add" value={manualSubject} onChange={e=>setManualSubject(e.target.value)} onKeyPress={handleKeyPress} className="subject-input"/>
          <button className="btn btn-add" onClick={addManualEntry}>Add Subject</button>
        </div>
        <p className="subject-info">Simply type the subject name and add it to start tracking attendance.</p>

        {timetable.length > 0 && (
          <div className="timetable-display">
            <div className="timetable-header">
              <h4>Your Subjects ({timetable.length})</h4>
              <button className="btn-toggle" onClick={()=>setShowTimetable(!showTimetable)}>{showTimetable?'Hide Subjects':'Show Subjects'}</button>
            </div>
            {showTimetable && (
              <div className="subjects-list">
                {subjects.map(subject => (
                  <div key={subject} className="subject-item">
                    <span className="subject-name">{subject}</span>
                    <button className="btn-remove" onClick={()=>removeTimetableEntry('General',subject)} title="Remove subject">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Calendar Section */}
      {subjects.length > 0 && (
        <div className="calendar-section">
          <h3>📅 Attendance Calendar</h3>
          <div className="calendar-subject-selector">
            <label htmlFor="calendar-subject">Select Subject to View Calendar:</label>
            <select 
              id="calendar-subject" 
              value={selectedSubjectForCalendar} 
              onChange={e => setSelectedSubjectForCalendar(e.target.value)}
              className="calendar-subject-select"
            >
              <option value="">Choose a subject...</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          {selectedSubjectForCalendar && renderCalendar()}
        </div>
      )}

      <div className="subjects-grid">
        {subjects.length === 0 ? <p className="no-classes-text">No subjects added yet. Add subjects above to start tracking attendance.</p> : subjects.map(subject => {
          const stat = calcStats(subject);
          const scheduledSessions = sessions
            .filter(s => s.subject === subject && s.status === 'scheduled')
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          return (
            <div key={subject} className="subject-card">
              <h3 className="subject-title">{subject}</h3>
              <div className="stats-overview">
                <p className={`percentage ${stat.percentage>=targetAttendance?'good':'warning'}`}>Attendance: {stat.percentage.toFixed(1)}%</p>
                <p className="total-classes">Total Classes: {stat.total}</p>
                {stat.extra>0 && <p className="extra-classes">Extra Classes: {stat.extra} (Present: {stat.extraAttended}, Absent: {stat.extraAbsent})</p>}
              </div>

              <div className="attendance-buttons-main">
                <h4>Mark Attendance</h4>
                <div className="date-selector">
                  <label htmlFor={`date-${subject}`}>Select Date:</label>
                  <input type="date" id={`date-${subject}`} className="date-picker" value={selectedDates[subject]||new Date().toISOString().split('T')[0]} onChange={e=>setSelectedDates(prev=>({...prev,[subject]:e.target.value}))}/>
                </div>
                <div className="main-attendance-buttons">
                  <button className="btn-present" onClick={()=>markAttendance(subject,selectedDates[subject]||new Date().toISOString().split('T')[0],'present','scheduled')}>Present</button>
                  <button className="btn-absent" onClick={()=>markAttendance(subject,selectedDates[subject]||new Date().toISOString().split('T')[0],'absent','scheduled')}>Absent</button>
                  <button className="btn-extra" onClick={()=>setShowExtraOptions({...showExtraOptions,[subject]:!showExtraOptions[subject]})}>Extra Class</button>
                </div>

                {/* Scheduled Class History */}
                {scheduledSessions.length > 0 && (
                  <div className="scheduled-history">
                    <h5>Scheduled Class History:</h5>
                    {scheduledSessions
                      .slice(0, scheduledShowMore[subject] ? undefined : 1)
                      .map(session => (
                        <div key={session.id} className="session-item">
                          <span>{session.date}</span>
                          <span className={session.attendance}>
                            {session.attendance === 'present' ? '✅ Present' : session.attendance === 'absent' ? '❌ Absent' : '⏳ Pending'}
                          </span>
                          <button
                            onClick={() => {
                              setSessions(prev => prev.filter(s => s.id !== session.id));
                              addToHistory('remove_session', session);
                            }}
                          >🗑️</button>
                        </div>
                      ))
                    }
                    {scheduledSessions.length > 1 && (
                      <button
                        className="btn-show-more"
                        onClick={() => setScheduledShowMore(prev => ({ ...prev, [subject]: !prev[subject] }))}
                      >
                        {scheduledShowMore[subject] ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </div>
                )}

                {/* Extra Class Section */}
                {stat.extra > 0 && (
                  <div className="extra-history">
                    <h5>Extra Class History:</h5>
                    {sessions
                      .filter(s => s.subject === subject && s.status === 'extra')
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .slice(0, extraShowMore[subject] ? undefined : 1)
                      .map(session => (
                        <div key={session.id} className="extra-session-item">
                          <span>{session.date}</span>
                          <span className={session.attendance}>
                            {session.attendance === 'present' ? '✅ Present' : session.attendance === 'absent' ? '❌ Absent' : '⏳ Pending'}
                          </span>
                          <button
                            onClick={() => {
                              setSessions(prev => prev.filter(s => s.id !== session.id));
                              addToHistory('remove_session', session);
                            }}
                          >🗑️</button>
                        </div>
                      ))
                    }
                    {sessions.filter(s => s.subject === subject && s.status === 'extra').length > 1 && (
                      <button
                        className="btn-show-more"
                        onClick={() => setExtraShowMore(prev => ({ ...prev, [subject]: !prev[subject] }))}
                      >
                        {extraShowMore[subject] ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </div>
                )}

                {/* Extra Mark Attendance Options */}
                {showExtraOptions[subject] && (
                  <div className="extra-options">
                    <button className="btn-present-small" onClick={()=>markAttendance(subject,selectedDates[subject]||new Date().toISOString().split('T')[0],'present','extra')}>Present</button>
                    <button className="btn-absent-small" onClick={()=>markAttendance(subject,selectedDates[subject]||new Date().toISOString().split('T')[0],'absent','extra')}>Absent</button>
                    <button className="btn-close-extra" onClick={()=>setShowExtraOptions({...showExtraOptions,[subject]:false})}>✕ Close</button>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceTracker;
