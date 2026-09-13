import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount, setCartCount] = useState(0);

    const navigate = useNavigate();

    const updateCartCount = () => {
        const savedCart = localStorage.getItem('cart');

        if (!savedCart) {
            setCartCount(0);
            return;
        }

        try {
            const cart = JSON.parse(savedCart);
            setCartCount(Array.isArray(cart) ? cart.length : 0);
        } catch {
            setCartCount(0);
        }
    };

    useEffect(() => {
        updateCartCount();

        window.addEventListener('cartUpdated', updateCartCount);
        window.addEventListener('storage', updateCartCount);

        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
            window.removeEventListener('storage', updateCartCount);
        };
    }, []);

    const handleSearchClick = () => {
        if (!isSearchVisible) {
            setIsSearchVisible(true);
            return;
        }

        if (searchQuery.trim()) {
            navigate(
                `/catalog.html?q=${encodeURIComponent(
                    searchQuery.trim(),
                )}`,
            );
            return;
        }

        setIsSearchVisible(false);
    };

    return (
        <header className="container">
            <div className="row">
                <div className="col">
                    <nav className="navbar navbar-expand-sm navbar-light bg-light">
                        <Link
                            className="navbar-brand"
                            to="/"
                        >
                            <img
                                src="./img/header-logo.png"
                                alt="Bosa Noga"
                            />
                        </Link>

                        <div
                            className="collapse navbar-collapse"
                            id="navbarMain"
                        >
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/"
                                    >
                                        Главная
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/catalog.html"
                                    >
                                        Каталог
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/about.html"
                                    >
                                        О магазине
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/contacts.html"
                                    >
                                        Контакты
                                    </Link>
                                </li>
                            </ul>

                            <div>
                                <div className="header-controls-pics">
                                    <div
                                        className="header-controls-pic header-controls-search"
                                        onClick={handleSearchClick}
                                    />

                                    <div
                                        className="header-controls-pic header-controls-cart"
                                        onClick={() =>
                                            navigate('/cart.html')
                                        }
                                    >
                                        {cartCount > 0 && (
                                            <div className="header-controls-cart-full">
                                                {cartCount}
                                            </div>
                                        )}

                                        <div className="header-controls-cart-menu" />
                                    </div>
                                </div>

                                <form
                                    className={`header-controls-search-form form-inline ${
                                        isSearchVisible
                                            ? ''
                                            : 'invisible'
                                    }`}
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        handleSearchClick();
                                    }}
                                >
                                    <input
                                        className="form-control"
                                        placeholder="Поиск"
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(
                                                event.target.value,
                                            )
                                        }
                                    />
                                </form>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}