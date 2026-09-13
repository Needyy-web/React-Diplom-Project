import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { CartItem, Item } from '../types';

export default function Product() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState<Item | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function getItem() {
            setIsLoading(true);
            setError('');

            try {
                const response = await fetch(
                    `http://localhost:7070/api/items/${id}`,
                );

                if (!response.ok) {
                    throw new Error('Ошибка загрузки товара');
                }

                const data: Item = await response.json();
                setItem(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Ошибка загрузки товара',
                );
            } finally {
                setIsLoading(false);
            }
        }

        getItem();
    }, [id]);

    const handleAddToCart = () => {
        if (!item || !selectedSize) {
            return;
        }

        let cart: CartItem[] = [];

        const savedCart = localStorage.getItem('cart');

        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
            } catch {
                cart = [];
            }
        }

        const existingItem = cart.find(
            (cartItem) =>
                cartItem.id === item.id &&
                cartItem.size === selectedSize,
        );

        if (existingItem) {
            existingItem.count = Math.min(
                existingItem.count + quantity,
                10,
            );
        } else {
            cart.push({
                id: item.id,
                title: item.title,
                price: item.price,
                size: selectedSize,
                count: quantity,
                image: item.images[0],
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));

        navigate('/cart.html');
    };

    if (isLoading) {
        return (
            <main className="container">
                <div className="row">
                    <div className="col">
                        <div className="preloader">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container">
                <div className="row">
                    <div className="col">
                        <p className="text-center text-danger">
                            {error}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (!item) {
        return null;
    }

    const availableSizes = item.sizes.filter(
        (size) => size.available,
    );

    return (
        <main className="container">
            <div className="row">
                <div className="col">
                    <section className="catalog-item">
                        <h2 className="text-center">
                            {item.title}
                        </h2>

                        <div className="row">
                            <div className="col-7">
                                <img
                                    src={item.images[0]}
                                    className="img-fluid"
                                    alt={item.title}
                                />
                            </div>

                            <div className="col-5">
                                <table className="table">
                                    <tbody>
                                    <tr>
                                        <td>Артикул</td>
                                        <td>{item.sku || ''}</td>
                                    </tr>

                                    <tr>
                                        <td>Производитель</td>
                                        <td>
                                            {item.manufacturer || ''}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Цвет</td>
                                        <td>
                                            {item.color || ''}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Материалы</td>
                                        <td>
                                            {item.material || ''}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Сезон</td>
                                        <td>
                                            {item.season || ''}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Цена</td>
                                        <td>
                                            {item.price} руб.
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                {availableSizes.length > 0 && (
                                    <>
                                        <div className="catalog-item-size mb-3">
                                            <p>Размеры:</p>

                                            <div className="d-flex flex-wrap">
                                                {availableSizes.map(
                                                    (size) => {
                                                        const value =
                                                            String(
                                                                size.size,
                                                            );

                                                        return (
                                                            <button
                                                                key={value}
                                                                type="button"
                                                                className={`btn btn-outline-secondary mr-2 mb-2 ${
                                                                    selectedSize ===
                                                                    value
                                                                        ? 'active'
                                                                        : ''
                                                                }`}
                                                                onClick={() =>
                                                                    setSelectedSize(
                                                                        value,
                                                                    )
                                                                }
                                                            >
                                                                {size.size}
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="quantity">
                                                Количество
                                            </label>

                                            <select
                                                id="quantity"
                                                className="form-control"
                                                value={quantity}
                                                onChange={(event) =>
                                                    setQuantity(
                                                        Number(
                                                            event.target
                                                                .value,
                                                        ),
                                                    )
                                                }
                                            >
                                                {Array.from(
                                                    { length: 10 },
                                                    (_, index) => (
                                                        <option
                                                            key={
                                                                index + 1
                                                            }
                                                            value={
                                                                index + 1
                                                            }
                                                        >
                                                            {index + 1}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            disabled={!selectedSize}
                                            onClick={handleAddToCart}
                                        >
                                            В корзину
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}