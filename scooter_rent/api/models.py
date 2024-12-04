# api/models.py
from datetime import timedelta
from decimal import Decimal

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None):
        user = self.create_user(username, email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(PermissionsMixin, AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Переопределяем эти поля с явно заданным related_name
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',  # Указываем unique related_name
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions_set',  # Указываем unique related_name
        blank=True
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'  # Используем email как уникальное поле для аутентификации
    REQUIRED_FIELDS = ['username']  # Указываем, что username обязателен

    def __str__(self):
        return self.username


class Location(models.Model):
    name = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    def __str__(self):
        return self.name

class Motorcycle(models.Model):
    model = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    year = models.IntegerField()
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    available = models.BooleanField(default=True)
    needs_repair = models.BooleanField(default=False)  # Указывает, нуждается ли мотоцикл в ремонте
    repair_notes = models.TextField(null=True, blank=True)  # Поле для записи комментариев о ремонте
    repair_date = models.DateTimeField(null=True, blank=True)  # Дата ремонта

    def __str__(self):
        return f'{self.brand} {self.model}'


class Rental(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    motorcycle = models.ForeignKey(Motorcycle, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=50,
                              choices=[('ACTIVE', 'Active'), ('COMPLETED', 'Completed'), ('CANCELLED', 'Cancelled')])

    def __str__(self):
        return f'Rental by {self.user} on {self.motorcycle}'

    def calculate_total_price(self):
        # Вычисляем продолжительность аренды
        rental_duration = self.end_time - self.start_time

        # Проверяем, что продолжительность аренды больше нуля
        if rental_duration <= timedelta(0):
            raise ValueError("End time must be after start time.")

        # Преобразуем продолжительность аренды в часы
        rental_hours = rental_duration.total_seconds() / 3600  # Преобразуем в часы

        # Получаем цену за час
        price_per_hour = Decimal(self.motorcycle.price_per_hour)  # Преобразуем в Decimal

        # Рассчитываем общую цену аренды
        total_price = Decimal(rental_hours) * price_per_hour  # Преобразуем rental_hours в Decimal и умножаем

        # Округляем до двух знаков после запятой
        self.total_price = total_price.quantize(Decimal('0.01'))

        # Сохраняем расчет в базу данных
        self.save()

    def save(self, *args, **kwargs):
        # Прежде чем сохранить аренду, вычислим total_price
        if not self.total_price:
            self.calculate_total_price()

        super(Rental, self).save(*args, **kwargs)


class Payment(models.Model):
    rental = models.OneToOneField(Rental, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=50, choices=[('PENDING', 'Pending'), ('PAID', 'Paid')])
    payment_method = models.CharField(max_length=50, choices=[('CREDIT_CARD', 'Credit Card'), ('PAYPAL', 'PayPal')])

    # Дополнительные поля для Stripe
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_payment_method_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f'Payment for rental {self.rental.id}'


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    motorcycle = models.ForeignKey(Motorcycle, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()

    def __str__(self):
        return f'Review by {self.user} for {self.motorcycle}'

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    motorcycle = models.ForeignKey(Motorcycle, on_delete=models.CASCADE)
    booking_time = models.DateTimeField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f'Booking by {self.user} for {self.motorcycle}'
