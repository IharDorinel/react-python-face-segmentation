from flask import Flask, request, jsonify
import numpy as np
import onnxruntime as ort
import cv2
import io
from PIL import Image
import base64
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Загрузка модели
model_path = "model/model_res.onnx"
session = ort.InferenceSession(model_path)

# Цвета для разных классов (RGB)
CLASS_COLORS = np.array([
    [255, 255, 0],     # Класс 0 - Желтый
    [255, 0, 0],       # Класс 1 - Красный
    [0, 255, 0],       # Класс 2 - Зеленый
    [0, 0, 255],       # Класс 3 - Синий
    [128, 0, 128],     # Класс 4 - Пурпурный
    [255, 0, 255],     # Класс 5 - Фиолетовый
    [128, 128, 128],   # Класс 6 - Серый
    [0, 255, 255],     # Класс 7 - Голубой
    [128, 128, 0],     # Класс 8 - Оливковый
    [0, 128, 128],     # Класс 9 - Темно-голубой
    [0, 0, 0],         # Класс 10 - Черный
], dtype=np.uint8)

@app.route('/')
def home():
    return "Backend Server"

@app.route('/api/predict', methods=['POST'])
def process_image():
    # Получаем файл изображения из запроса
    file = request.files['image']

    # Преобразуем изображение в формат, который можно обработать
    img = Image.open(io.BytesIO(file.read()))
    img = np.array(img)  # Преобразуем изображение в массив numpy

    # Подгоняем размер и нормализуем изображение
    input_shape = session.get_inputs()[0].shape
    img = cv2.resize(img, (input_shape[2], input_shape[3]))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB) / 255.0
    img = np.transpose(img, (2, 0, 1))  # (H, W, C) → (C, H, W)
    img = np.expand_dims(img, axis=0).astype(np.float32)

    # Получаем предсказания
    input_name = session.get_inputs()[0].name
    output = session.run(None, {input_name: img})[0]

    # Преобразуем выход в маску (например, если это вероятности классов)
    mask = np.argmax(output, axis=1)[0]
    color_mask = CLASS_COLORS[mask]

    # Сохраняем маску как изображение
    _, img_mask = cv2.imencode('.png', color_mask)
    mask_base64 = base64.b64encode(img_mask).decode("utf-8")

    return jsonify({'mask': mask_base64})

if __name__ == '__main__':
    app.run(debug=True)