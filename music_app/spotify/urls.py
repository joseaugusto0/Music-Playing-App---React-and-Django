from .views import AuthURL, CurrentSong, IsAuthenticated, PauseSong, PlaySong, SkipSong, spotify_callback
from django.urls import include, path

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
    path('pause-song', PauseSong.as_view()),
    path('play-song', PlaySong.as_view()),
    path('skip-song', SkipSong.as_view())
]
