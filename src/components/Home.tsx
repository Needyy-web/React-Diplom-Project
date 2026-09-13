import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Categories, Items } from '../types';

export default function Home() {
    const [categories, setCategories] = useState<Categories>([]);
    const [items, setItems] = useState<Items>([]);
    const [topSales, setTopSales] = useState<Items>([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const [isLoadingTopSales, setIsLoadingTopSales] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [topSalesError, setTopSalesError] = useState('');
    const [categoriesError, setCategoriesError] = useState('');
    const [itemsError, setItemsError] = useState('');
    const [loadMoreError, setLoadMoreError] = useState('');

    const [hasMoreItems, setHasMoreItems] = useState(true);

    const allData = { id: 16, title: 'Все' };
    const itemsUrl = 'http://localhost:7070/api/items';
    const categoriesUrl = 'http://localhost:7070/api/categories';
    const topSalesUrl = 'http://localhost:7070/api/top-sales';

    useEffect(() => {
        async function getTopSales() {
            setIsLoadingTopSales(true);
            setTopSalesError('');

            try {
                const response = await fetch(topSalesUrl);

                if (!response.ok) {
                    throw new Error('Ошибка загрузки хитов продаж');
                }

                const data = await response.json();
                setTopSales(data);
            } catch (error) {
                setTopSalesError(
                    error instanceof Error
                        ? error.message
                        : 'Ошибка загрузки хитов продаж',
                );
            } finally {
                setIsLoadingTopSales(false);
            }
        }

        getTopSales();
    }, []);

    useEffect(() => {
        async function getCategories() {
            setIsLoadingCategories(true);
            setCategoriesError('');

            try {
                const response = await fetch(categoriesUrl);

                if (!response.ok) {
                    throw new Error('Ошибка загрузки категорий');
                }

                const data = await response.json();
                setCategories([allData, ...data]);
            } catch (error) {
                setCategoriesError(
                    error instanceof Error
                        ? error.message
                        : 'Ошибка загрузки категорий',
                );
            } finally {
                setIsLoadingCategories(false);
            }
        }

        getCategories();
    }, []);

    useEffect(() => {
        async function getItems() {
            setIsLoadingItems(true);
            setItemsError('');
            setLoadMoreError('');
            setHasMoreItems(true);

            try {
                const params = new URLSearchParams();

                if (
                    selectedCategoryId !== null &&
                    selectedCategoryId !== allData.id
                ) {
                    params.set(
                        'categoryId',
                        String(selectedCategoryId),
                    );
                }

                const query = params.toString();
                const url = query
                    ? `${itemsUrl}?${query}`
                    : itemsUrl;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Ошибка загрузки товаров');
                }

                const data = await response.json();

                setItems(data);

                if (data.length < 6) {
                    setHasMoreItems(false);
                }
            } catch (error) {
                setItemsError(
                    error instanceof Error
                        ? error.message
                        : 'Ошибка загрузки товаров',
                );
                setItems([]);
                setHasMoreItems(false);
            } finally {
                setIsLoadingItems(false);
            }
        }

        getItems();
    }, [selectedCategoryId]);

    const handleChangeCategory = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
    };

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        setLoadMoreError('');

        try {
            const params = new URLSearchParams();
            params.set('offset', String(items.length));

            if (
                selectedCategoryId !== null &&
                selectedCategoryId !== allData.id
            ) {
                params.set(
                    'categoryId',
                    String(selectedCategoryId),
                );
            }

            const response = await fetch(
                `${itemsUrl}?${params.toString()}`,
            );

            if (!response.ok) {
                throw new Error('Ошибка загрузки товаров');
            }

            const data = await response.json();

            setItems((prevItems) => [...prevItems, ...data]);

            if (data.length < 6) {
                setHasMoreItems(false);
            }
        } catch (error) {
            setLoadMoreError(
                error instanceof Error
                    ? error.message
                    : 'Ошибка загрузки товаров',
            );
        } finally {
            setIsLoadingMore(false);
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

                    {(isLoadingTopSales ||
                        topSalesError ||
                        topSales.length > 0) && (
                        <section className="top-sales">
                            <h2 className="text-center">
                                Хиты продаж!
                            </h2>

                            {isLoadingTopSales && (
                                <div className="preloader">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            )}

                            {topSalesError && (
                                <div>{topSalesError}</div>
                            )}

                            {!isLoadingTopSales &&
                                !topSalesError &&
                                topSales.length > 0 && (
                                    <div className="row">
                                        {topSales.map((item) => (
                                            <div
                                                className="col-4"
                                                key={item.id}
                                            >
                                                <div className="card catalog-item-card">
                                                    <img
                                                        className="card-img-top img-fluid"
                                                        src={item.images[0]}
                                                        alt={item.title}
                                                    />

                                                    <div className="card-body">
                                                        <p className="card-text">
                                                            {item.title}
                                                        </p>

                                                        <p className="card-text">
                                                            {item.price} руб.
                                                        </p>

                                                        <Link
                                                            className="btn btn-outline-primary"
                                                            to={`/catalog/${item.id}.html`}
                                                        >
                                                            Заказать
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </section>
                    )}

                    <section className="catalog">
                        <h2 className="text-center">
                            Каталог
                        </h2>

                        {isLoadingCategories && (
                            <div className="preloader">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        )}

                        {categoriesError && (
                            <div>{categoriesError}</div>
                        )}

                        {!isLoadingCategories &&
                            !categoriesError && (
                                <ul className="catalog-categories nav justify-content-center">
                                    {categories.map((category) => (
                                        <li
                                            className="nav-item"
                                            key={category.id}
                                        >
                                            <button
                                                type="button"
                                                className={`nav-link ${
                                                    (
                                                        selectedCategoryId ===
                                                        category.id ||
                                                        (
                                                            selectedCategoryId ===
                                                            null &&
                                                            category.id ===
                                                            allData.id
                                                        )
                                                    )
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    handleChangeCategory(
                                                        category.id,
                                                    )
                                                }
                                            >
                                                {category.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                        {isLoadingItems && (
                            <div className="preloader">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        )}

                        {itemsError && (
                            <div>{itemsError}</div>
                        )}

                        {!isLoadingItems &&
                            !itemsError && (
                                <div className="row">
                                    {items.map((item) => (
                                        <div
                                            className="col-4"
                                            key={item.id}
                                        >
                                            <div className="card catalog-item-card">
                                                <img
                                                    className="card-img-top img-fluid"
                                                    src={item.images[0]}
                                                    alt={item.title}
                                                />

                                                <div className="card-body">
                                                    <p className="card-text">
                                                        {item.title}
                                                    </p>

                                                    <p className="card-text">
                                                        {item.price} руб.
                                                    </p>

                                                    <Link
                                                        className="btn btn-outline-primary"
                                                        to={`/catalog/${item.id}.html`}
                                                    >
                                                        Заказать
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        {!isLoadingItems &&
                            !itemsError &&
                            hasMoreItems && (
                                <div className="text-center">
                                    {loadMoreError && (
                                        <div>{loadMoreError}</div>
                                    )}

                                    {isLoadingMore && (
                                        <div className="preloader">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                    >
                                        Загрузить ещё
                                    </button>
                                </div>
                            )}
                    </section>
                </div>
            </div>
        </main>
    );
}