# Используем Python 3.10
FROM python:3.10

# Установка библиотеки libGL, необходимой для OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends libgl1-mesa-glx

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY requirements.txt /app/

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем весь backend
COPY . /app/

# Открываем порт 5000
EXPOSE 5000

# Запускаем сервер через gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]