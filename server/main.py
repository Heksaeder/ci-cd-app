import os

import mysql.connector
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
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "db"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE"),
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
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))


@app.get("/health/db")
def check_db():
    try:
        conn = get_db_connection()
        conn.close()
        return {"status": "ok", "database": "connected"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))