import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link, NavLink } from "react-router-dom";
import "../../styles/header.css";
import { jwtDecode } from "jwt-decode"; // Для декодирования JWT токена

const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/cars",
    display: "Scooters",
  },
  {
    path: "/blogs",
    display: "Maintenance",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

const Header = () => {
  const menuRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние для проверки авторизации
  const [userName, setUserName] = useState(""); // Состояние для хранения имени пользователя

  const toggleMenu = () => menuRef.current.classList.toggle("menu__active");

  // Проверяем наличие токена и декодируем его для получения информации
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Декодируем токен и проверяем, есть ли в нем информация
        const decodedToken = jwtDecode(token);
        console.log("Decoded token:", decodedToken); // Логирование декодированного токена для проверки

        if (decodedToken) {
          setIsLoggedIn(true); // Если токен валиден, то пользователь авторизован
          setUserName(decodedToken.name || "User"); // Если имя есть в токене, устанавливаем его
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsLoggedIn(false); // Если токен невалиден, сбрасываем статус авторизации
      }
    } else {
      setIsLoggedIn(false); // Если токен отсутствует, то пользователь не авторизован
    }
  }, []);

  // Функция для выхода пользователя
  const handleLogout = () => {
    localStorage.removeItem("token"); // Удаляем токен из localStorage
    setIsLoggedIn(false); // Меняем состояние на неавторизованный
    window.location.reload(); // Перезагружаем страницу
  };

  return (
    <header className="header">
      {/* ============ header top ============ */}
      <div className="header__top">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              <div className="header__top__left">
                <span>Need Help?</span>
                <span className="header__top__help">
                  <i className="ri-phone-fill"></i> +7-777-777-77-77
                </span>
              </div>
            </Col>

            <Col lg="6" md="6" sm="6">
              <div className="header__top__right d-flex align-items-center justify-content-end gap-3">
                {isLoggedIn ? (
                  <>
                    <span className="user-name">{userName}</span> {/* Отображаем имя пользователя */}
                    <Link
                      to="/login"
                      onClick={handleLogout} // При клике вызываем функцию logout
                      className="d-flex align-items-center gap-1"
                    >
                      <i className="ri-logout-box-line"></i> Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="d-flex align-items-center gap-1">
                      <i className="ri-login-circle-line"></i> Login
                    </Link>
                    <Link to="/register" className="d-flex align-items-center gap-1">
                      <i className="ri-user-line"></i> Register
                    </Link>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* =============== header middle =========== */}
      <div className="header__middle">
        <Container>
          <Row>
            <Col lg="4" md="3" sm="4">
              <div className="logo">
                <h1>
                  <Link to="/home" className="d-flex align-items-center gap-2">
                    <i className="fontisto-motorcycle"></i>
                    <span>
                      Rent Scooter <br /> Service
                    </span>
                  </Link>
                </h1>
              </div>
            </Col>

            <Col lg="3" md="3" sm="4">
              <div className="header__location d-flex align-items-center gap-2">
                <span>
                  <i className="ri-earth-line"></i>
                </span>
                <div className="header__location-content">
                  <h4>Kazakhstan</h4>
                  <h6>Almaty, Kazakhstan</h6>
                </div>
              </div>
            </Col>

            <Col lg="3" md="3" sm="4">
              <div className="header__location d-flex align-items-center gap-2">
                <span>
                  <i className="ri-time-line"></i>
                </span>
                <div className="header__location-content">
                  <h4>Monday to Sunday</h4>
                  <h6>10:00 - 20:00</h6>
                </div>
              </div>
            </Col>

            <Col lg="2" md="3" sm="0" className="d-flex align-items-center justify-content-end">
              <button className="header__btn btn">
                <Link to="/contact">
                  <i className="ri-phone-line"></i> Request a call
                </Link>
              </button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ========== main navigation =========== */}

      <div className="main__navbar">
        <Container>
          <div className="navigation__wrapper d-flex align-items-center justify-content-between">
            <span className="mobile__menu">
              <i className="ri-menu-line" onClick={toggleMenu}></i>
            </span>

            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <div className="menu">
                {navLinks.map((item, index) => (
                  <NavLink
                    to={item.path}
                    className={(navClass) =>
                      navClass.isActive ? "nav__active nav__item" : "nav__item"
                    }
                    key={index}
                  >
                    {item.display}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="nav__right">
              <div className="search__box">
                <input type="text" placeholder="Search" />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header;
