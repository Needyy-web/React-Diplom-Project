import { useState } from 'react';

export default function ErrorPage() {
  const [searchVisible, setSearchVisible] = useState(false);

  return (
    <>
      <header className="container">
        <div className="row">
          <div className="col">
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
              <a className="navbar-brand" href="/">
                <img src="/img/header-logo.png" alt="Bosa Noga" />
              </a>

              <div className="collapse navbar-collapse" id="navbarMain">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <a className="nav-link" href="/">Главная</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/catalog.html">Каталог</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/about.html">О магазине</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/contacts.html">Контакты</a>
                  </li>
                </ul>

                <div>
                  <div className="header-controls-pics">
                    <div
                      className="header-controls-pic header-controls-search"
                      onClick={() => setSearchVisible(!searchVisible)}
                    />

                    <div className="header-controls-pic header-controls-cart">
                      <div className="header-controls-cart-full">1</div>
                      <div className="header-controls-cart-menu" />
                    </div>
                  </div>

                  <form
                    className={`header-controls-search-form form-inline ${
    !searchVisible ? 'invisible' : ''
}`}
                  >
                    <input className="form-control" placeholder="Поиск" />
                  </form>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="row">
          <div className="col">
            <div className="banner">
              <img
                src="/img/banner.jpg"
                className="img-fluid"
                alt="К весне готовы!"
              />
              <h2 className="banner-header">К весне готовы!</h2>
            </div>

            <section className="top-sales">
              <h2 className="text-center">Страница не найдена</h2>
              <p>Извините, такая страница не найдена!</p>
            </section>
          </div>
        </div>
      </main>

      <footer className="container bg-light footer">
        <div className="row">
          <div className="col">
            <section>
              <h5>Информация</h5>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a href="/about.html" className="nav-link">
                    О магазине
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/catalog.html" className="nav-link">
                    Каталог
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/contacts.html" className="nav-link">
                    Контакты
                  </a>
                </li>
              </ul>
            </section>
          </div>

          <div className="col">
            <section>
              <h5>Принимаем к оплате:</h5>

              <div className="footer-pay">
                <div className="footer-pay-systems footer-pay-systems-paypal" />
                <div className="footer-pay-systems footer-pay-systems-master-card" />
                <div className="footer-pay-systems footer-pay-systems-visa" />
                <div className="footer-pay-systems footer-pay-systems-yandex" />
                <div className="footer-pay-systems footer-pay-systems-webmoney" />
                <div className="footer-pay-systems footer-pay-systems-qiwi" />
              </div>
            </section>

            <section>
              <div className="footer-copyright">
                2009-2019 © BosaNoga.ru — модный интернет-магазин обуви и
                аксессуаров. Все права защищены.
                <br />
                Доставка по всей России!
              </div>
            </section>
          </div>

          <div className="col text-right">
            <section className="footer-contacts">
              <h5>Контакты:</h5>

              <a
                className="footer-contacts-phone"
                href="tel:+7-495-790-35-03"
              >
                +7 495 79 03 5 03
              </a>

              <span className="footer-contacts-working-hours">
                Ежедневно: с 09-00 до 21-00
              </span>

              <a
                className="footer-contacts-email"
                href="mailto:office@bosanoga.ru"
              >
                office@bosanoga.ru
              </a>

              <div className="footer-social-links">
                <div className="footer-social-link footer-social-link-twitter" />
                <div className="footer-social-link footer-social-link-vk" />
              </div>
            </section>
          </div>
        </div>
      </footer>
    </>
  );
}


