import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// import logo from './logo.svg';
import './App.css';


import React, { useState, useEffect } from 'react';
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// import FileDropzone from './components/FileDropzone';
// import Navbar from './components/Navbar';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

import Upload from './pages/Upload';
import Translation from './pages/Translation';


function App() {
  const [pdfDataUrl, setPdfDataUrl] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/translation" element={<Translation />} />
      </Routes>
    </Router>

    // <div className="flex flex-col w-full border-opacity-50">
    //   <Navbar></Navbar>
    //   <div className="grid card bg-base-300 rounded-box place-items-center">
    //     {pdfDataUrl ? (
    //       <iframe title="Generated PDF" src={pdfDataUrl} width="100%" height="600px"></iframe>
    //     ) : (
    //       <FileDropzone onFileProcessed={setPdfDataUrl} />
    //     )}
    //   </div>
     
    // </div>

  );
}

export default App;
