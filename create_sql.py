import jwt

SECRET = "super-secret-jwt-token-with-at-least-32-characters-long"
payload = {
    "role": "anon",
    "iss": "supabase",
    "iat": 1788136763,
    "exp": 2103712763
}

token = jwt.encode(payload, SECRET, algorithm="HS256")
print(token)