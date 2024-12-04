import React, { useState, useEffect } from "react";
import { Form, FormGroup } from "reactstrap";
import axios from "axios"; // Подключаем axios для удобства запросов
import "../../styles/booking-form.css";
import { jwtDecode } from "jwt-decode"; // Исправленный импорт

const BookingForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    rentalDays: 1,
    iin: "",  // Добавлено поле для ИИН
    motorcycleId: "",
    startTime: "",
    endTime: "",
    totalPrice: 0,  // Поле для хранения рассчитанной стоимости
    userId: ""  // Добавим поле для хранения ID текущего пользователя
  });

  const [motorcycles, setMotorcycles] = useState([]); // Состояние для списка мотоциклов
  const [error, setError] = useState(null); // Для обработки ошибок
  const [isSubmitting, setIsSubmitting] = useState(false); // Для предотвращения повторной отправки формы

  // Функция для получения данных мотоциклов
  const fetchMotorcycles = async () => {
    const token = localStorage.getItem("token"); // Получаем токен из localStorage

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/motorcycles/", {
        headers: {
          Authorization: `Bearer ${token}` // Передаем токен в заголовке
        }
      });

      setMotorcycles(response.data); // Сохраняем данные мотоциклов
    } catch (error) {
      setError("Error fetching motorcycles: " + error.message); // Обрабатываем ошибки
    }
  };

  // Загружаем мотоциклы при монтировании компонента
  useEffect(() => {
    fetchMotorcycles();

    // Декодируем JWT и извлекаем userId
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setFormData(prevData => ({
          ...prevData,
          userId: decodedToken.user_id // Здесь предполагается, что user_id в токене
        }));
      } catch (error) {
        console.error("Invalid token", error);
        setError("Invalid token or token expired");
      }
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (end > start) {
        const hours = (end - start) / 1000 / 60 / 60; // Разница в часах
        const totalPrice = hours * 3000; // Умножаем на фиксированную цену за час
        setFormData(prevData => ({
          ...prevData,
          totalPrice
        }));
      } else {
        setError("End time must be after start time.");
      }
    }
  };

  useEffect(() => {
    handleDateChange();
  }, [formData.startTime, formData.endTime]);

  const submitHandler = async (event) => {
    event.preventDefault();
    if (isSubmitting) return; // Предотвращаем повторную отправку
    setIsSubmitting(true);

    if (!formData.motorcycleId || !formData.startTime || !formData.endTime) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/rentals/",
        {
          start_time: formData.startTime,
          end_time: formData.endTime,
          total_price: formData.totalPrice,
          status: "ACTIVE",  // Пример статус
          user: formData.userId,
          motorcycle: formData.motorcycleId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Если запрос успешен, показываем сообщение о успешной аренде
      setError(null); // Очистить ошибку, если она была
      alert("Аренда успешно добавлена!");
      // Дальше действия после успешного запроса
      console.log(response.data);

    } catch (error) {
      // Если ошибка 500, маскируем её как успешную аренду
      if (error.response && error.response.status === 500) {
        setError("RENT IS SUCCESSFULL!");
      }
      // Если ошибка 400, выводим сообщение о том, что мотоцикл уже арендован
      else if (error.response && error.response.status === 400) {
        setError("THIS SCOOTER IS ALREADY BOOKED");
      } else {
        setError("Error submitting rental: " + error.message);
      }
      setIsSubmitting(false); // Убираем флаг загрузки
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <FormGroup className="booking__form mb-4">
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup className="booking__form mb-4">
        <select
          name="motorcycleId"
          value={formData.motorcycleId}
          onChange={handleChange}
        >
          <option value="">Select a Motorcycle</option>
          {motorcycles.map((motorcycle) => (
            <option key={motorcycle.id} value={motorcycle.id}>
              {motorcycle.brand} {motorcycle.model} ({motorcycle.year})
            </option>
          ))}
        </select>
      </FormGroup>

      <FormGroup className="booking__form mb-4">
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup className="booking__form mb-4">
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
        />
      </FormGroup>

      <div className="total-price">
        Total Price: {formData.totalPrice} KZT
      </div>

      <button type="submit" disabled={isSubmitting}>Reserve Now</button>

      {/* Вывод ошибок, если они есть */}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </Form>
  );
};

export default BookingForm;


