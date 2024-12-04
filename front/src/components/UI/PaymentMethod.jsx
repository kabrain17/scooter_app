import React from "react";
import kaspiQr from "../../assets/all-images/kaspiqr.png"; // Импортируем изображение QR-кода
import "../../styles/payment-method.css";

const PaymentMethod = () => {
  return (
    <>
      {/* Секция оплаты через Kaspi QR */}
      <div className="payment mt-3 d-flex align-items-center justify-content-between">
        <label htmlFor="kaspiqr" className="d-flex align-items-center gap-2">
        </label>
        <img
          src={kaspiQr}
          alt="Kaspi QR Code"
          style={{
            width: "320px",
            height: "380px",
            position: "relative",
            left: "-7.2cm", // Сдвиг влево на 3 см
          }}
        /> {/* Изображение QR-кода */}
      </div>
    </>
  );
};

export default PaymentMethod;
