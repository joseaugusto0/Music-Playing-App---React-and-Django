from .views import index
from django.urls import include, path

urlpatterns = [
    path('', index),
    path('join', index),
    path('create', index),
    path('room/<str:roomCode>', index)
]
