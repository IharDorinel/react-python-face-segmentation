# Используем Python 3.10 как базовый образ (замени на свою версию)
FROM python:3.10

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы проекта
COPY . /app

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Запускаем приложение (замени на свою команду)
CMD ["python", "backend/app.py"]