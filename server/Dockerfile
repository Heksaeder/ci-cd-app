FROM python:3.11-alpine

RUN apk add --no-cache curl

WORKDIR /server

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD uvicorn main:app --proxy-headers --host 0.0.0.0 --port ${PORT:-8000}