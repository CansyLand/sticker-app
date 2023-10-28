import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Upload from './pages/Upload';
import Translation from './pages/Translation';
import './App.css';


function App() {

  return (
    <Router basename="/privatsachen/sticker-app">
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/translation" element={<Translation />} />
      </Routes>
    </Router>
  );
}

export default App;
