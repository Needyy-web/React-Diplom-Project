import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Catalog from './components/Catalog';
import Contacts from './components/Contacts';
import Product from './components/Product';
import Cart from './components/Cart';
import { Routes, Route } from 'react-router-dom';

export default function App() {
    return (
        <div>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog.html" element={<Catalog />} />
                <Route path="/catalog/:id.html" element={<Product />} />
                <Route path="/cart.html" element={<Cart />} />
                <Route path="/about.html" element={<About />} />
                <Route path="/contacts.html" element={<Contacts />} />
                <Route
                    path="*"
                    element={
                        <main className="container">
                            <h1>404 — Страница не найдена</h1>
                        </main>
                    }
                />
            </Routes>

            <Footer />
        </div>
    );
}