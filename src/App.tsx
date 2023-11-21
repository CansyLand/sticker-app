import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react'
import UploaderPage from './pages/UploaderPage'
import TranslationPage from './pages/TranslationPage'
import './App.css'

function App() {
	const basename = process.env.REACT_APP_STICKER_APP_PATH || ''

	return (
		<Router basename={basename}>
			<Routes>
				<Route path='/' element={<UploaderPage />} />
				<Route path='/translation' element={<TranslationPage />} />
			</Routes>
		</Router>
	)
}

export default App
