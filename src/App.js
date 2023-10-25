import logo from './logo.svg';
import './App.css';


import React, { useState, useEffect } from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const [pdfDataUri, setPdfDataUri] = useState(null);

  useEffect(() => {
    generatePDF();
  }, []);

  function generatePDF() {
    const documentDefinition = {
      content: "Hello World!"
    };

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator.getDataUrl((dataUri) => {
      setPdfDataUri(dataUri);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload 🍕
          <br />
          <button className="btn btn-primary">Click me</button>
        </p>
        {pdfDataUri && (
          <iframe 
            src={pdfDataUri} 
            title="Generated PDF" 
            width="100%" 
            height="400px"
          ></iframe>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
