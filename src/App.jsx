import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDetailsPage from './pages/UserDetailsPage';
import SchemeResultsPage from './components/UserProfile/SchemeResults.jsx';
import './styles/global.css';
import ProfileChoicePage from './pages/ProfileChoicePage';
import DocumentUploadPage from './pages/DocumentUploadPage';
function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile-choice" element={<ProfileChoicePage />} />
            <Route path="/document-upload" element={<DocumentUploadPage />} />
            <Route
              path="/user-details"
              element={
                isLoggedIn
                  ? <UserDetailsPage />
                  : <Navigate to="/login" />
              }
            />

            <Route path="/scheme-results" element={<SchemeResultsPage />} />
            <Route path="/browse" element={<div>Browse Schemes Page</div>} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;