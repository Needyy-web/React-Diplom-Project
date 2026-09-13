import { useSearchParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Categories, Items } from '../types';

export default function Catalog() {
    const [searchParams, setSearchParams] = useSearchParams();

    const urlParam = searchParams.get('q');
    const categoryParam = searchParams.get('categoryId');

    const [categories, setCategories] = useState<Categories>([]);
    const [items, setItems] = useState<Items>([]);
    const [searchInput, setSearchInput] = useState('');

    const [hasMoreItems, setHasMoreItems] = useState(true);

    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    const [itemsError, setItemsError] = useState('');
    const [categoriesError, setCategoriesError] = useState('');
    const [loadMoreError, setLoadMoreError] = useState('');

    const allData = { id: 16, title: 'Все' };
    const funcUrl = 'http://localhost:7070/api/items';
    const categoriesUrl = 'http://localhost:7070/api/categories';

    useEffect(() => {
        if (urlParam !== null) {
            setSearchInput(urlParam);
        } else {
            setSearchInput('');
        }
    }, [urlParam]);

    useEffect(() => {
        async function getCatalogCategories() {
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

        getCatalogCategories();
    }, []);

    const handleChangeCategoryId = (selectedCategoryId: number) => {
        const params = new URLSearchParams(searchParams);

        if (selectedCategoryId === allData.id) {
            params.delete('categoryId');
        } else {
            params.set('categoryId', String(selectedCategoryId));
        }

        setSearchParams(params);
    };

    const getParams = (offset?: number) => {
        const params = new URLSearchParams();

        if (urlParam) {
            params.set('q', urlParam);
        }

        if (categoryParam) {
            params.set('categoryId', categoryParam);
        }

        if (offset !== undefined) {
            params.set('offset', String(offset));
        }

        const query = params.toString();

        return query ? `?${query}` : '';
    };

    useEffect(() => {
        async function getItems() {
            setIsLoadingItems(true);
            setItemsError('');
            setLoadMoreError('');
            setHasMoreItems(true);

            try {
                const url = funcUrl + getParams();
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
    }, [categoryParam, urlParam]);

    const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams);
        const value = searchInput.trim();

        if (value) {
            params.set('q', value);
        } else {
            params.delete('q');
        }

        setSearchParams(params);
    };

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        setLoadMoreError('');

        try {
            const offset = items.length;
            const url = funcUrl + getParams(offset);

            const response = await fetch(url);

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
        <>
            <main className="container">
                <div className="row">
                    <div className="col">
                        <div className="banner">
                            <img
                                src="./img/banner.jpg"
                                className="img-fluid"
                                alt="К весне готовы!"
                            />
                            <h2 className="banner-header">К весне готовы!</h2>
                        </div>

                        <section className="catalog">
                            <h2 className="text-center">Каталог</h2>

                            <form
                                className="catalog-search-form form-inline"
                                onSubmit={handleSearchSubmit}
                            >
                                <input
                                    className="form-control"
                                    placeholder="Поиск"
                                    onChange={(e) =>
                                        setSearchInput(e.target.value)
                                    }
                                    value={searchInput}
                                />
                            </form>

                            {isLoadingCategories && <div>Loading...</div>}

                            {categoriesError && (
                                <div>{categoriesError}</div>
                            )}

                            {!isLoadingCategories && !categoriesError && (
                                <ul className="catalog-categories nav justify-content-center">
                                    {categories.map((category) => (
                                        <li
                                            className="nav-item"
                                            key={category.id}
                                        >
                                            <button
                                                type="button"
                                                className={`nav-link ${
                                                    category.id ===
                                                    Number(categoryParam) ||
                                                    (category.id ===
                                                        allData.id &&
                                                        categoryParam === null)
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    handleChangeCategoryId(
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
                                <div className="text-center">
                                    Loading...
                                </div>
                            )}

                            {itemsError && (
                                <div className="text-center">
                                    {itemsError}
                                </div>
                            )}

                            {!isLoadingItems && !itemsError && (
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
                                            <div>Loading...</div>
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
        </>
    );
}