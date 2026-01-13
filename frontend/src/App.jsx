import Footer from './assets/components/Footer/index.jsx'
import Header from './assets/components/Header/index.jsx'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'


function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className='mainContainer'>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
