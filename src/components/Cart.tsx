import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { CartItem } from '../types';

export default function Cart() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [agreement, setAgreement] = useState(false);

    const [isOrdering, setIsOrdering] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');

        if (!savedCart) {
            return;
        }

        try {
            setCart(JSON.parse(savedCart));
        } catch {
            localStorage.removeItem('cart');
        }
    }, []);

    const saveCart = (newCart: CartItem[]) => {
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleRemove = (index: number) => {
        const newCart = cart.filter(
            (_, itemIndex) => itemIndex !== index,
        );

        saveCart(newCart);
    };

    const handleChangeCount = (index: number, count: number) => {
        const newCart = cart.map((item, itemIndex) =>
            itemIndex === index
                ? { ...item, count }
                : item,
        );

        saveCart(newCart);
    };

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.count,
        0,
    );

    const handleSubmitOrder = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!agreement) {
            setError('Необходимо согласиться с правилами доставки');
            return;
        }

        setError('');
        setSuccess('');
        setIsOrdering(true);

        try {
            const response = await fetch(
                'http://localhost:7070/api/order',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        owner: {
                            phone,
                            address,
                        },
                        items: cart.map((item) => ({
                            id: item.id,
                            price: item.price,
                            count: item.count,
                        })),
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('Ошибка оформления заказа');
            }

            setCart([]);
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdated'));

            setPhone('');
            setAddress('');
            setAgreement(false);
            setSuccess('Заказ успешно оформлен');
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Ошибка оформления заказа',
            );
        } finally {
            setIsOrdering(false);
        }
    };

    return (
        <main className="container">
            <div className="row">
                <div className="col">
                    <div className="banner">
                        <img
                            src="./img/banner.jpg"
                            className="img-fluid"
                            alt="К весне готовы!"
                        />
                        <h2 className="banner-header">
                            К весне готовы!
                        </h2>
                    </div>

                    <section className="cart">
                        <h2 className="text-center">
                            Корзина
                        </h2>

                        {cart.length === 0 ? (
                            <p className="text-center">
                                {success
                                    ? success
                                    : 'В корзине пока ничего нет.'}
                            </p>
                        ) : (
                            <>
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">
                                            Название
                                        </th>
                                        <th scope="col">
                                            Размер
                                        </th>
                                        <th scope="col">
                                            Кол-во
                                        </th>
                                        <th scope="col">
                                            Стоимость
                                        </th>
                                        <th scope="col">
                                            Итого
                                        </th>
                                        <th scope="col">
                                            Действия
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {cart.map((item, index) => (
                                        <tr
                                            key={`${item.id}-${item.size}`}
                                        >
                                            <td scope="row">
                                                {index + 1}
                                            </td>

                                            <td>
                                                {item.title}
                                            </td>

                                            <td>
                                                {item.size}
                                            </td>

                                            <td>
                                                <select
                                                    className="form-control"
                                                    value={item.count}
                                                    onChange={(event) =>
                                                        handleChangeCount(
                                                            index,
                                                            Number(
                                                                event
                                                                    .target
                                                                    .value,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    {Array.from(
                                                        {
                                                            length: 10,
                                                        },
                                                        (_, count) => (
                                                            <option
                                                                key={
                                                                    count +
                                                                    1
                                                                }
                                                                value={
                                                                    count +
                                                                    1
                                                                }
                                                            >
                                                                {count + 1}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </td>

                                            <td>
                                                {item.price} руб.
                                            </td>

                                            <td>
                                                {item.price *
                                                    item.count}{' '}
                                                руб.
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() =>
                                                        handleRemove(
                                                            index,
                                                        )
                                                    }
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-right"
                                        >
                                            Общая стоимость
                                        </td>
                                        <td>
                                            {totalPrice} руб.
                                        </td>
                                        <td></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </>
                        )}
                    </section>

                    {cart.length > 0 && (
                        <section className="order">
                            <h2 className="text-center">
                                Оформить заказ
                            </h2>

                            <div
                                className="card"
                                style={{
                                    maxWidth: '30rem',
                                    margin: '0 auto',
                                }}
                            >
                                <form
                                    className="card-body"
                                    onSubmit={handleSubmitOrder}
                                >
                                    <div className="form-group">
                                        <label htmlFor="phone">
                                            Телефон
                                        </label>

                                        <input
                                            className="form-control"
                                            id="phone"
                                            placeholder="Ваш телефон"
                                            value={phone}
                                            onChange={(event) =>
                                                setPhone(
                                                    event.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="address">
                                            Адрес доставки
                                        </label>

                                        <input
                                            className="form-control"
                                            id="address"
                                            placeholder="Адрес доставки"
                                            value={address}
                                            onChange={(event) =>
                                                setAddress(
                                                    event.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="form-group form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="agreement"
                                            checked={agreement}
                                            onChange={(event) =>
                                                setAgreement(
                                                    event.target.checked,
                                                )
                                            }
                                        />

                                        <label
                                            className="form-check-label"
                                            htmlFor="agreement"
                                        >
                                            Согласен с правилами
                                            доставки
                                        </label>
                                    </div>

                                    {error && (
                                        <div className="text-danger mb-3">
                                            {error}
                                        </div>
                                    )}

                                    {isOrdering && (
                                        <div className="preloader">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-outline-secondary"
                                        disabled={isOrdering}
                                    >
                                        {isOrdering
                                            ? 'Оформление...'
                                            : 'Оформить'}
                                    </button>
                                </form>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}