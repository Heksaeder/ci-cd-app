import os

import psycopg2
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # à restreindre à l'URL de ton front en prod
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegisterPayload(BaseModel):
    lastName: str
    firstName: str
    email: str
    birthDate: str
    city: str
    postalCode: str


def get_db_connection():
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        # Format fourni par Render pour sa base PostgreSQL managée
        return psycopg2.connect(database_url)
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "db"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        user=os.getenv("POSTGRES_USER", "pgck"),
        password=os.getenv("POSTGRES_PASSWORD"),
        dbname=os.getenv("POSTGRES_DATABASE"),
    )


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