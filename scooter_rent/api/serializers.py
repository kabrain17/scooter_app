from rest_framework import serializers
from .models import User, Location, Motorcycle, Rental, Payment, Review, Booking
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = get_user_model()
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'


class MotorcycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Motorcycle
        fields = ['id', 'model', 'brand', 'year', 'price_per_hour', 'location', 'available', 'needs_repair', 'repair_notes', 'repair_date']

class MotorcycleRepairSerializer(serializers.ModelSerializer):
    class Meta:
        model = Motorcycle
        fields = ['needs_repair', 'repair_notes', 'repair_date']

class RentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rental
        fields = '__all__'

    def validate(self, data):
        # Проверяем, существует ли аренда для данного пользователя и мотоцикла в это время
        user = data.get('user')
        motorcycle = data.get('motorcycle')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        # Проверяем, есть ли пересечение временных интервалов для данного пользователя и мотоцикла
        if Rental.objects.filter(user=user, motorcycle=motorcycle, start_time__lt=end_time, end_time__gt=start_time).exists():
            raise serializers.ValidationError("This motorcycle is already booked during the selected time.")

        return data

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
