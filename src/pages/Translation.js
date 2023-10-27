
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TableRow from '../components/Translation/TableRow';




function Translation() {

  return (
    <div className="flex flex-col w-full border-opacity-50">
      <Navbar></Navbar>
      <TableRow tablerow="warengruppe" />
      <TableRow tablerow="qualitaet1_hinweis" />
      <TableRow tablerow="farb_bezeichnung" />
      <TableRow tablerow="ursprungsland" />
    </div>

  );
}

export default Translation;
