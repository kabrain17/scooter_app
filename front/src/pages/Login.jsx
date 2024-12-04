import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";  // Используем useNavigate вместо useHistory

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",  // Меняем на email
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Используем useNavigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Отправка данных для логина
    fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access) {  // Проверяем наличие токена (или другого поля, которое сервер возвращает)
          localStorage.setItem("token", data.access);  // Сохранение токена в localStorage
          navigate("/home");  // Перенаправляем на страницу Home
        } else {
          setError("Invalid email or password.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Something went wrong!");
      });
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg="6" md="8" sm="12">
          <h2 className="text-center">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <Button type="submit" color="primary" block>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
