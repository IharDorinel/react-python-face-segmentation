# Используем Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь фронтенд
COPY . .

# Сборка фронтенда
RUN npm run build

# Открываем порт 3000
EXPOSE 3000

# Запуск сервера
CMD ["npm", "start"]