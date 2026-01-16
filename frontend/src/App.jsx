<<<<<<< Updated upstream
import Footer from './assets/components/Footer/index.jsx';
import Header from './assets/components/Header/index.jsx';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';


function App() {
  return (
    <BrowserRouter>
<<<<<<< Updated upstream
      <Header />
      <main className='mainContainer'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/:id/edit" element={<EditProduct />} />
        </Routes>
      </main>
      <Footer />
=======
      <AppContent />
>>>>>>> Stashed changes
    </BrowserRouter>
  );
}

export default App;
