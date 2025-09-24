// // import React, { useState } from 'react';
// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // // Import all your page components
// // import Login from './Components/Login';
// // import Profile from './Components/Profile';
// // import Dashboard from './Components/Dashboard';
// // import Subjects from './Components/Subjects';
// // import PdfListPage from './Components/PdfListPage'; // The new intermediate page
// // import PdfViewer from './Components/PdfViewer';

// // // Import your global CSS file
// // import './App.css';

// // function App() {
// //   // State to manage the user's login status and data
// //   const [user, setUser] = useState(null);
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);

// //   // This function is passed to the Login component
// //   const handleLogin = (userData) => {
// //     setUser(userData);
// //     setIsLoggedIn(true);
// //   };

// //   // This function is passed to all protected components
// //   const handleLogout = () => {
// //     setUser(null);
// //     setIsLoggedIn(false);
// //   };

// //   // This is a helper component to protect routes that require a login.
// //   // It checks if the user is logged in. If not, it redirects them to the login page.
// //   const ProtectedRoute = ({ children }) => {
// //     return isLoggedIn ? children : <Navigate to="/login" />;
// //   };

// //   return (
// //     <Router>
// //       <div className="App">
// //         <Routes>
// //           {/* --- Public Route --- */}
// //           <Route 
// //             path="/login" 
// //             element={
// //               !isLoggedIn ? 
// //               <Login onLogin={handleLogin} /> : 
// //               <Navigate to="/dashboard" />
// //             } 
// //           />
          
// //           {/* --- Protected Routes (can only be accessed after login) --- */}
// //           <Route 
// //             path="/profile" 
// //             element={<ProtectedRoute><Profile user={user} onLogout={handleLogout} /></ProtectedRoute>} 
// //           />
// //           <Route 
// //             path="/dashboard" 
// //             element={<ProtectedRoute><Dashboard user={user} onLogout={handleLogout} /></ProtectedRoute>} 
// //           />
// //           <Route 
// //             path="/subjects/:cycle/:type" 
// //             element={<ProtectedRoute><Subjects user={user} onLogout={handleLogout} /></ProtectedRoute>} 
// //           />
          
// //           {/* --- NEW ROUTE for the list of PDFs --- */}
// //           <Route 
// //             path="/pdfs/:cycle/:type/:subjectId" 
// //             element={<ProtectedRoute><PdfListPage user={user} onLogout={handleLogout} /></ProtectedRoute>} 
// //           />
          
// //           {/* --- UPDATED ROUTE for the final PDF viewer --- */}
// //           <Route 
// //             path="/view/:cycle/:subjectId/:type/:pdfId" 
// //             element={<ProtectedRoute><PdfViewer user={user} onLogout={handleLogout} /></ProtectedRoute>} 
// //           />
          
// //           {/* Route for direct syllabus PDF view from dashboard */}
// //           <Route 
// //             path="/view/syllabus/:cycle/syllabus/main" 
// //             element={<ProtectedRoute><PdfViewer user={user} onLogout={handleLogout} /></ProtectedRoute>}
// //           />

// //           {/* --- Default Route --- */}
// //           {/* If the user visits the base URL "/", automatically redirect them to the login page */}
// //           <Route path="/" element={<Navigate to="/login" />} />
// //         </Routes>
// //       </div>
// //     </Router>
// //   );
// // }

// // export default App;

// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Import all your page components
// import Login from './Components/Login';
// import Profile from './Components/Profile';
// import Dashboard from './Components/Dashboard';
// import Subjects from './Components/Subjects';
// import PdfListPage from './Components/PdfListPage'; // The new intermediate page
// import PdfViewer from './Components/PdfViewer';

// // Import your global CSS file
// import './App.css';

// function App() {
//   // State to manage the user's login status and data
//   const [user, setUser] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // This function is passed to the Login component
//   const handleLogin = (userData) => {
//     setUser(userData);
//     setIsLoggedIn(true);
//   };

//   // This function is passed to all protected components
//   const handleLogout = () => {
//     setUser(null);
//     setIsLoggedIn(false);
//   };

//   // This is a helper component to protect routes that require a login.
//   // It checks if the user is logged in. If not, it redirects them to the login page.
//   const ProtectedRoute = ({ children }) => {
//     return isLoggedIn ? children : <Navigate to="/login" />;
//   };

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* --- Public Route --- */}
//           <Route 
//             path="/login" 
//             element={
//               !isLoggedIn ? 
//               <Login onLogin={handleLogin} /> : 
//               <Navigate to="/dashboard" />
//             } 
//           />
          
//           {/* --- Protected Routes (can only be accessed after login) --- */}
//           <Route 
//             path="/profile" 
//             element={<ProtectedRoute><Profile user={user} onLogout={handleLogout} /></ProtectedRoute>} 
//           />
//           <Route 
//             path="/dashboard" 
//             element={<ProtectedRoute><Dashboard user={user} onLogout={handleLogout} /></ProtectedRoute>} 
//           />
//           <Route 
//             path="/subjects/:cycle/:type" 
//             element={<ProtectedRoute><Subjects user={user} onLogout={handleLogout} /></ProtectedRoute>} 
//           />
          
//           {/* --- NEW ROUTE for the list of PDFs --- */}
//           <Route 
//             path="/pdfs/:cycle/:type/:subjectId" 
//             element={<ProtectedRoute><PdfListPage user={user} onLogout={handleLogout} /></ProtectedRoute>} 
//           />
          
//           {/* --- UPDATED ROUTE for the final PDF viewer --- */}
//           <Route 
//             path="/view/:cycle/:subjectId/:type/:pdfId" 
//             element={<ProtectedRoute><PdfViewer user={user} onLogout={handleLogout} /></ProtectedRoute>} 
//           />
          
//           {/* Route for direct syllabus PDF view from dashboard */}
//           <Route 
//             path="/view/syllabus/:cycle/syllabus/main" 
//             element={<ProtectedRoute><PdfViewer user={user} onLogout={handleLogout} /></ProtectedRoute>}
//           />

//           {/* --- Default Route --- */}
//           {/* If the user visits the base URL "/", automatically redirect them to the login page */}
//           <Route path="/" element={<Navigate to="/login" />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react'
import Register from './Components/Register.jsx'

const App = () => {
  return (
    <div>
      <Register/>
    </div>
  )
}

export default App
