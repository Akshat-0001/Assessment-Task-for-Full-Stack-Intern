import { Routes, Route } from 'react-router-dom'
import ListPage from './pages/ListPage'
import FormPage from './pages/FormPage'
import DetailsPage from './pages/DetailsPage'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/add" element={<FormPage />} />
        <Route path="/edit/:id" element={<FormPage />} />
        <Route path="/user/:id" element={<DetailsPage />} />
      </Routes>
    </div>
  )
}

export default App
