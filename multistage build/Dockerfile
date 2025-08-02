# Stage 1: Build with all dependencies
FROM python:3.9-slim AS builder

WORKDIR /app
COPY requirements.txt .
COPY app.py .
RUN pip install --no-cache-dir -r requirements.txt

FROM gcr.io/distroless/python3-debian11:latest

WORKDIR /app
COPY --from=builder /app .  
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages  

ENV PORT=5000

CMD [ "python3" , "app.py"]
