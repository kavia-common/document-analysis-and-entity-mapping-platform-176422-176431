import React from 'react';
import UploadCard from './components/UploadCard';
import './App.css';
import './index.css';

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">Doc Analyzer MVP</div>
      </header>
      <main className="main">
        <UploadCard />
      </main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} Ocean Professional</span>
      </footer>
    </div>
  );
}

export default App;
