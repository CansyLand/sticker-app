import Navbar from 'components/common/Navbar'
import TableRow from 'components/translation/TableRow'

function TranslationPage() {
	return (
		<div className='flex flex-col w-full border-opacity-50'>
			<Navbar></Navbar>
			<TableRow tablerow='warengruppe' />
			<TableRow tablerow='qualitaet1_hinweis' />
			<TableRow tablerow='farb_bezeichnung' />
			<TableRow tablerow='ursprungsland' />
		</div>
	)
}

export default TranslationPage
