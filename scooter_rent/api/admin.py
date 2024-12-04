from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Location, Motorcycle, Rental, Payment, Review, Booking


# Пользовательская админка для модели User
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('id', 'email', 'username', 'first_name', 'last_name', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('is_active', 'is_staff')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('date_joined',)
    readonly_fields = ('date_joined',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'username')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )


admin.site.register(User, CustomUserAdmin)


# Модель Location
class LocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'latitude', 'longitude')
    search_fields = ('name',)
    ordering = ('name',)


admin.site.register(Location, LocationAdmin)


# Модель Motorcycle
class MotorcycleAdmin(admin.ModelAdmin):
    list_display = (
    'id', 'model', 'brand', 'year', 'price_per_hour', 'location', 'available', 'needs_repair', 'repair_date')
    list_filter = ('available', 'location', 'needs_repair')
    search_fields = ('model', 'brand')
    ordering = ('brand', 'model')

    # Функция для обновления статуса "ремонтируем"
    def mark_as_repaired(self, request, queryset):
        queryset.update(needs_repair=False, repair_notes="Repaired",
                        repair_date=models.DateTimeField(auto_now_add=True))

    mark_as_repaired.short_description = "Mark selected motorcycles as repaired"

    actions = [mark_as_repaired]


admin.site.register(Motorcycle, MotorcycleAdmin)


# Модель Rental
class RentalAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'motorcycle', 'start_time', 'end_time', 'total_price', 'status')
    list_filter = ('status', 'motorcycle__location', 'user')
    search_fields = ('user__username', 'motorcycle__model')
    ordering = ('start_time',)


admin.site.register(Rental, RentalAdmin)


# Модель Payment
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
    'id', 'rental', 'amount', 'payment_date', 'payment_status', 'payment_method', 'stripe_payment_intent_id',
    'stripe_payment_method_id')
    list_filter = ('payment_status', 'payment_method')
    search_fields = ('rental__id',)
    ordering = ('payment_date',)


admin.site.register(Payment, PaymentAdmin)


# Модель Review
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'motorcycle', 'rating', 'comment')
    list_filter = ('rating', 'motorcycle')
    search_fields = ('user__username', 'motorcycle__model', 'comment')
    ordering = ('rating',)


admin.site.register(Review, ReviewAdmin)


# Модель Booking
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'motorcycle', 'booking_time', 'start_time', 'end_time')
    list_filter = ('start_time', 'motorcycle')
    search_fields = ('user__username', 'motorcycle__model')
    ordering = ('booking_time',)


admin.site.register(Booking, BookingAdmin)
