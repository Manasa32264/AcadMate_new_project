import React, { useState } from 'react';

const styles = `
/* Root CSS Variables */
:root {
  --white: white;
  --beige: #fbf9f1;
  --accent: #f4b30c;
  --black: black;
  --brown: #1a1200;
  --beige-footer: #ddd9c5;
}

/* Main Container */
.seniors-profiles {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--beige) 0%, #f8f6f0 100%);
  padding: 2rem 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.profiles-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header Section */
.profiles-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.profiles-header h1 {
  font-size: 3rem;
  color: var(--brown);
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.profiles-subtitle {
  font-size: 1.3rem;
  color: var(--brown);
  opacity: 0.8;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Profiles Grid */
.profiles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Profile Card */
.profile-card {
  background: var(--white);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  max-height: 500px;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent), #ff8c42);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  border-color: var(--accent);
  max-height: none;
}

.profile-card:hover::before {
  opacity: 1;
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

/* Profile Avatar */
.profile-avatar {
  flex-shrink: 0;
}

.avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}

.profile-card:hover .avatar-img {
  transform: scale(1.05);
}

/* Profile Info */
.profile-info {
  flex: 1;
  text-align: left;
}

.profile-name {
  font-size: 1.3rem;
  color: var(--brown);
  margin-bottom: 0.3rem;
  font-weight: 700;
}

.profile-title {
  font-size: 1rem;
  color: var(--accent);
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.profile-experience {
  font-size: 0.85rem;
  color: var(--brown);
  opacity: 0.8;
  margin-bottom: 0.3rem;
  font-style: italic;
}

.profile-location {
  font-size: 0.8rem;
  color: var(--brown);
  opacity: 0.7;
  margin-bottom: 0.3rem;
}

.profile-availability {
  font-size: 0.8rem;
  color: #28a745;
  font-weight: 600;
  background: rgba(40, 167, 69, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  display: inline-block;
}

/* Profile Expertise */
.profile-expertise {
  margin-bottom: 1rem;
}

.profile-expertise h4 {
  color: var(--brown);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.expertise-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.expertise-tag {
  background: linear-gradient(135deg, var(--accent) 0%, #ff8c42 100%);
  color: var(--white);
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(244, 179, 12, 0.3);
}

.more-tag {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  box-shadow: 0 2px 6px rgba(108, 117, 125, 0.3);
}

/* Profile Bio */
.profile-bio {
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: rgba(244, 179, 12, 0.05);
  border-radius: 8px;
  border-left: 3px solid var(--accent);
}

.profile-bio p {
  color: var(--brown);
  line-height: 1.5;
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

/* Profile Actions */
.profile-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.contact-btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  min-width: 80px;
  justify-content: center;
  flex: 1;
}

.email-btn {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: var(--white);
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.email-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
  background: linear-gradient(135deg, #0056b3 0%, #007bff 100%);
}

.linkedin-btn {
  background: linear-gradient(135deg, #0077b5 0%, #005885 100%);
  color: var(--white);
  box-shadow: 0 4px 15px rgba(0, 119, 181, 0.3);
}

.linkedin-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 119, 181, 0.4);
  background: linear-gradient(135deg, #005885 0%, #0077b5 100%);
}

.toggle-btn {
  background: linear-gradient(135deg, var(--accent) 0%, #ff8c42 100%);
  color: var(--white);
  box-shadow: 0 4px 15px rgba(244, 179, 12, 0.3);
  flex: 0 0 auto;
  min-width: 100px;
}

.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(244, 179, 12, 0.4);
  background: linear-gradient(135deg, #ff8c42 0%, var(--accent) 100%);
}

/* Call to Action */
.profiles-cta {
  background: var(--white);
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--accent);
}

.profiles-cta h2 {
  color: var(--brown);
  font-size: 2.2rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.profiles-cta p {
  color: var(--brown);
  opacity: 0.8;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* Responsive Design */
@media (max-width: 768px) {
  .seniors-profiles {
    padding: 1rem 0.5rem;
  }
  
  .profiles-header h1 {
    font-size: 2.2rem;
  }
  
  .profiles-subtitle {
    font-size: 1.1rem;
  }
  
  .profiles-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .profile-card {
    padding: 1.5rem;
  }
  
  .profile-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .contact-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .profiles-cta {
    padding: 2rem 1.5rem;
  }
  
  .profiles-cta h2 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .profiles-header h1 {
    font-size: 1.8rem;
  }
  
  .profile-card {
    padding: 1rem;
  }
  
  .avatar-emoji {
    font-size: 3rem;
  }
  
  .profile-name {
    font-size: 1.3rem;
  }
  
  .profiles-cta {
    padding: 1.5rem 1rem;
  }
}

/* Accessibility Improvements */
.contact-btn:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .profile-card {
    border: 2px solid var(--brown);
  }
  
  .expertise-tag {
    border: 1px solid var(--brown);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .profile-card,
  .contact-btn,
  .avatar-emoji {
    transition: none;
  }
  
  .profile-card:hover {
    transform: none;
  }
  
  .contact-btn:hover {
    transform: none;
  }
  
  .profile-card:hover .avatar-emoji {
    transform: none;
  }
}
`;

const SeniorsProfiles = () => {
  const [expandedCards, setExpandedCards] = useState(new Set());

  const seniorsData = [
    {
      id: 1,
      name: "Bhaskar",
      title: "Pre final year student",
      experience: "3 years in mentoring juniors and leading college clubs.",
      expertise: ["Literature", "Creative Writing", "Mentoring"],
      Skills: "Python, Machine Learning, React.js",
      bio: "Passionate about helping young minds discover the beauty of literature. Available for mentoring and academic guidance.",
      email: "bhaskarbhaskr09@gmail.com",
      linkedin: "https://www.linkedin.com/in/bhaskara-88aa76322",
      avatar: "https://media.licdn.com/dms/image/v2/D4D03AQFesFldH12gcg/profile-displayphoto-shrink_800_800/B4DZcI1agTGkAc-/0/1748199910428?e=1761782400&v=beta&t=mIa9OqOuKOJ59b6RrKqvK7O8wSu0Sw2hjtN-QA3GaCM",
      location: "Mysore",
      availability: "Available for guidance"
    },
    {
      id: 2,
      name: "Manasa H N",
      title: "Pre final year student",
      experience: "Active contributor in college literary and tech clubs with hands-on leadership experience.",
      expertise: ["Literature", "Creative Writing", "Mentoring"],
      Skills: "Java, Spring Boot, JDBC, UI/UX",
      bio: "Passionate about helping young minds discover the beauty of literature. Available for mentoring and academic guidance.",
      email: "manasa14102004@gmail.com",
      linkedin: "https://www.linkedin.com/in/manasa-h-n-0383bb331",
      avatar: "https://media.licdn.com/dms/image/v2/D4E03AQE2TTkAldGOCg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1729087501866?e=1761782400&v=beta&t=0-kJuw8tajJOpbR0Mwxe9M_8_yLwYJXEuxIlTSD8w8k",
      location: "Mysore",
      availability: "Available for guidance"
    }
  ];

  const handleContact = (type, profile) => {
    if (type === 'email') window.open(`mailto:${profile.email}?subject=Hello from ${profile.name}`);
    else if (type === 'linkedin') window.open(profile.linkedin, '_blank');
  };

  const toggleCardExpansion = (cardId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) newExpanded.delete(cardId);
    else newExpanded.add(cardId);
    setExpandedCards(newExpanded);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="seniors-profiles">
        <div className="profiles-grid">
      {seniorsData.map(senior => {
        const isExpanded = expandedCards.has(senior.id);
        return (
          <div key={senior.id} className="profile-card bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-4 mb-4">
              <img src={senior.avatar} alt={senior.name} className="w-20 h-20 rounded-full" />
              <div>
                <h3 className="text-xl font-bold">{senior.name}</h3>
                <p className="text-sm">{senior.title}</p>
                <p className="text-sm"><b>Experience:</b> {senior.experience}</p>
                <p className="text-sm">📍 {senior.location}</p>
                <p className="text-sm">{senior.availability}</p>
                <p className="text-sm"><b>Skills:</b> {senior.Skills}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold">Expertise:</h4>
              <div className="flex gap-2 flex-wrap">
                {senior.expertise.slice(0, 2).map((skill, i) => (
                  <span key={i} className="bg-gray-200 px-2 py-1 rounded">{skill}</span>
                ))}
                {senior.expertise.length > 2 && !isExpanded && (
                  <span className="bg-gray-200 px-2 py-1 rounded">+{senior.expertise.length - 2} more</span>
                )}
                {isExpanded && senior.expertise.slice(2).map((skill, i) => (
                  <span key={i + 2} className="bg-gray-200 px-2 py-1 rounded">{skill}</span>
                ))}
              </div>
            </div>

            {isExpanded && <p className="mb-4">{senior.bio}</p>}

            <div className="flex gap-2">
              <button className="btn bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleContact('email', senior)}>📧 Email</button>
              <button className="btn bg-blue-700 text-white px-3 py-1 rounded" onClick={() => handleContact('linkedin', senior)}>💼 LinkedIn</button>
              <button className="btn bg-gray-300 px-3 py-1 rounded" onClick={() => toggleCardExpansion(senior.id)}>
                {isExpanded ? '👆 See Less' : '👇 See More'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
      </div>
    </>
  );
};

export default SeniorsProfiles;
