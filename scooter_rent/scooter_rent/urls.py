from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from api.views import RegisterView
from api.views import create_payment_intent, confirm_payment


urlpatterns = [
    # Админка Django
    path('admin/', admin.site.urls),

    # Основной API
    path('api/', include('api.urls')),

    # Маршруты для регистрации, логина и обновления токенов
    path('api/login/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Получение JWT токена (вход)
    path('api/login/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),  # Обновление JWT токена
    path('api/register/', RegisterView.as_view(), name='register'),  # Регистрация нового пользователя
    path('create-payment-intent/', create_payment_intent, name='create_payment_intent'),
    path('confirm-payment/', confirm_payment, name='confirm_payment'),

]
