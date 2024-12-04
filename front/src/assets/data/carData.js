// import all images from assets/images directory
import img01 from "../all-images/cars-img/nissan-offer.png";
import img02 from "../all-images/cars-img/offer-toyota.png";
import img03 from "../all-images/cars-img/bmw-offer.png";
import img04 from "../all-images/cars-img/nissan-offer.png";
import img05 from "../all-images/cars-img/offer-toyota.png";
import img06 from "../all-images/cars-img/mercedes-offer.png";
import img07 from "../all-images/cars-img/toyota-offer-2.png";
import img08 from "../all-images/cars-img/mercedes-offer.png";

const carData = [
  {
    id: 1,
    brand: "Tank",
    rating: 10,
    carName: "Tank 500",
    imgUrl: img01,
    model: "Model 500",
    price: 3000,
    speed: "110km/h",
    gps: "GPS Navigation",
    seatType: "Normal seat",
    automatic: "Automatic",
    description:
      " Мощный скутер с максимальной скоростью 110 км/ч, идеально подходящий для активного и динамичного стиля езды. Прочная конструкция и высокая надежность делают его отличным выбором для ежедневного использования.",
  },

  {
    id: 2,
    brand: "Samurai",
    rating: 8.9,
    carName: "Samurai",
    imgUrl: img02,
    model: "Model-2024",
    price: 3000,
    speed: "110km/h",
    gps: "GPS Navigation",
    seatType: "Normal seats",
    automatic: "Automatic",
    description:
      " Элегантный и манёвренный скутер с возможностью разгона до 110 км/ч. Он сочетает стильный дизайн, высокую скорость и комфорт, идеально подходит для тех, кто ценит эстетику и практичность.",
  },

  {
    id: 3,
    brand: "M8",
    rating: 7.3,
    carName: "Scooter M8",
    imgUrl: img03,
    model: "Model 2024",
    price: 3000,
    speed: "90km/h",
    gps: "GPS Navigation",
    seatType: "Heated seats",
    automatic: "Automatic",
    description:
      " Компактный скутер с максимальной скоростью 90 км/ч, идеально подходящий для спокойных городских поездок. Его экономичность и удобство в эксплуатации делают его отличным выбором для начинающих водителей.",
  },

];

export default carData;
