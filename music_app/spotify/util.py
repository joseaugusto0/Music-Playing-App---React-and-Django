
from datetime import timedelta
import os
import base64
from .credentials import CLIENT_ID, CLIENT_SECRET
from .models import SpotifyToken
from django.utils import timezone
from requests import get, post, put

def get_user_tokens(session_key):
    user_tokens = SpotifyToken.objects.filter(user=session_key)

    if user_tokens.exists():
        return user_tokens[0]

    return None

def update_or_create_user_tokens(session_key, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_key)
    _expires_in = timezone.now() + timedelta(seconds= expires_in)

    if tokens: #Just updating the value in database
        tokens.acess_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = _expires_in
        token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in','token_type'])
    else:
        tokens = SpotifyToken(
            user=session_key, 
            access_token = access_token,
            refresh_token = refresh_token,
            expires_in = _expires_in,
            token_type = token_type
        )
        tokens.save()

def is_spotify_authenticated(session_key):
    tokens = get_user_tokens(session_key)

    if tokens:
        expiry = tokens.expires_in

        if expiry <= timezone.now():
            refresh_spotify_token(tokens,session_key)

        return True

    return False

def refresh_spotify_token(tokens,session_key:str = ""):
    refresh_token = tokens.refresh_token
    
    #headers = {
    #    'Authorization': f"Basic {client_encoded}"
    #}
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': os.environ.get('CLIENT_ID'),
        'client_secret': os.environ.get('CLIENT_SECRET')
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = refresh_token

    update_or_create_user_tokens(
        session_key, 
        access_token=access_token, 
        token_type=token_type, 
        expires_in=expires_in, 
        refresh_token=refresh_token)

def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    header = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokens.access_token 
    }

    if post_:
        post(os.environ.get('BASE_URL') + endpoint, headers=header)

    if put_:
        put(os.environ.get('BASE_URL') + endpoint, headers=header)

    #The {} in the middle is because the sintax says that we need to send something in GET requests
    response = get(os.environ.get('BASE_URL') + endpoint, {}, headers=header)
    print(response)
    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}

