from .views import AuthURL, IsAuthenticated, spotify_callback
from django.urls import include, path

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view())
]
