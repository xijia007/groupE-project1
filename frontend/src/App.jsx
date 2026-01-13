import Footer from './assets/components/Footer/index.jsx'
import Header from './assets/components/Header/index.jsx'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Cart from './pages/Cart.jsx'
import CreateProduct from './pages/CreateProduct.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import UserProfile from './pages/UserProfile.jsx'


function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className='mainContainer'>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/createProduct" element={<CreateProduct />} />

          <Route path="/productDetail" element={<ProductDetail />} />

          <Route path="/userProfile" element={<UserProfile />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
