from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, LocationViewSet, MotorcycleViewSet, RentalViewSet, PaymentViewSet, ReviewViewSet, BookingViewSet, MotorcycleRepairViewSet

# Создание маршрутизатора для автоматической генерации URL-ов
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'motorcycles', MotorcycleViewSet)
router.register(r'rentals', RentalViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'motorcycle-repair', MotorcycleRepairViewSet, basename='motorcycle-repair')




urlpatterns = [
    path('', include(router.urls)),  # Включаем все API ресурсы

]
