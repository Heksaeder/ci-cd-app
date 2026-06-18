import os
from datetime import datetime, timedelta, timezone

import jwt
import psycopg2
import psycopg2.extras
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # à restreindre à l'URL de ton front en prod
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60


class RegisterPayload(BaseModel):
    lastName: str
    firstName: str
    email: str
    birthDate: str
    city: str
    postalCode: str


class LoginPayload(BaseModel):
    email: str
    password: str


def get_db_connection():
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        # Format fourni par Render pour sa base PostgreSQL managée
        return psycopg2.connect(database_url)
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "db"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        user=os.getenv("POSTGRES_USER", "postgres"),
        password=os.getenv("POSTGRES_PASSWORD"),
        dbname=os.getenv("POSTGRES_DATABASE"),
    )


def create_access_token(email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")
    return payload["sub"]


@app.on_event("startup")
def seed_admin():
    """Crée le compte administrateur initial depuis les variables d'environnement,
    uniquement s'il n'existe pas déjà (idempotent, donc sûr à chaque redémarrage)."""
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    if not admin_email or not admin_password:
        return

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM admins WHERE email = %s", (admin_email,))
    if cursor.fetchone() is None:
        password_hash = pwd_context.hash(admin_password)
        cursor.execute(
            "INSERT INTO admins (email, password_hash) VALUES (%s, %s)",
            (admin_email, password_hash),
        )
        conn.commit()
    cursor.close()
    conn.close()


@app.get("/")
def read_root():
    return {"message": "API is running"}


@app.post("/register")
def register_user(payload: RegisterPayload):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO users (last_name, first_name, email, birth_date, city, postal_code)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                payload.lastName,
                payload.firstName,
                payload.email,
                payload.birthDate,
                payload.city,
                payload.postalCode,
            ),
        )
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "success", "message": "Utilisateur enregistré"}
    except psycopg2.Error as err:
        raise HTTPException(status_code=500, detail=str(err))


@app.get("/users")
def list_users():
    """Liste publique : uniquement les informations réduites (nom, prénom, ville)."""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute(
        "SELECT id, last_name AS \"lastName\", first_name AS \"firstName\", city FROM users ORDER BY id"
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


@app.get("/admin/users")
def list_users_full(admin_email: str = Depends(get_current_admin)):
    """Liste complète réservée à l'admin : toutes les informations des inscrits."""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute(
        """
        SELECT id, last_name AS "lastName", first_name AS "firstName", email,
               birth_date AS "birthDate", city, postal_code AS "postalCode"
        FROM users ORDER BY id
        """
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows


@app.delete("/admin/users/{user_id}")
def delete_user(user_id: int, admin_email: str = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    deleted = cursor.rowcount
    conn.commit()
    cursor.close()
    conn.close()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return {"status": "success", "message": "Utilisateur supprimé"}


@app.post("/admin/login")
def admin_login(payload: LoginPayload):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute("SELECT email, password_hash FROM admins WHERE email = %s", (payload.email,))
    admin = cursor.fetchone()
    cursor.close()
    conn.close()

    if admin is None or not pwd_context.verify(payload.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Identifiants invalides")

    token = create_access_token(admin["email"])
    return {"access_token": token, "token_type": "bearer"}


@app.get("/health/db")
def check_db():
    try:
        conn = get_db_connection()
        conn.close()
        return {"status": "ok", "database": "connected"}
    except psycopg2.Error as err:
        raise HTTPException(status_code=500, detail=str(err))


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)