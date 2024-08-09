import Navbar from 'components/common/Navbar'
import TableRow from 'components/translation/TableRow'

function TranslationPage() {
	return (
		<div className='flex flex-col w-full border-opacity-50'>
			<Navbar></Navbar>
			<TableRow tablerow='Produktgruppenbezeichnung' />
			<TableRow tablerow='Materialzusammensetzung' />
			<TableRow tablerow='Größenbezeichnung' />
			<TableRow tablerow='Ursprungsland laut Modell-/Artikelstamm (Bezeichnung)' />
		</div>
	)
}

export default TranslationPage
