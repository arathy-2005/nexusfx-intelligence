FROM python:3.12-slim
WORKDIR /app
COPY ml/requirements.txt /app/ml/requirements.txt
RUN pip install --no-cache-dir -r /app/ml/requirements.txt
COPY ml /app/ml
ENV PYTHONPATH=/app
EXPOSE 8000
CMD ["uvicorn", "ml.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
