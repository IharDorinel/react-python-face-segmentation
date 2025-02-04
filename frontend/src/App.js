import React, { useState } from "react";
import { Button, CircularProgress, Container, Typography, Box, Paper } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import './App.css';

function App() {  

  const [image, setImage] = useState(null);
  const [mask, setMask] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
  if (file) {
    setImage(URL.createObjectURL(file));
    handleSubmit(file); // передаем файл напрямую
  }
  }

  const handleSubmit = async (file) => {
    if (!file) return;

  setLoading(true);

  // Создаем форму для отправки изображения на сервер
  const formData = new FormData();
  formData.append("image", file); // используем файл, переданный в handleSubmit

  try {
    // Отправляем изображение на сервер для обработки
    const response = await fetch("http://127.0.0.1:5000/api/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Ошибка при отправке запроса');
    }

    const result = await response.json();
    
    const mask_image = `data:image/png;base64,${result.mask}`
    
    setMask(mask_image); // сохраняем полученную маску

  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    setLoading(false);
  }
  }

  return (
    <Container className="App" maxWidth="sm">
      <Typography variant="h3" align="center" gutterBottom>
        Сегментация лица
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
      <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="upload-button"
      />
      <label htmlFor="upload-button">
      <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<UploadFile />}
          >
            Загрузить изображение
          </Button>
      </label>
      {image && (
          <Box sx={{ marginTop: 3 }}>
            <img src={image} 
            alt="Загруженное изображение" 
            style={{ width: "100%", height: "100%"}} />
          </Box>
        )}
      {loading && (
          <Box sx={{ marginTop: 3 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Обработка...
            </Typography>
          </Box>
        )}
      {mask && (
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Результат сегментации
            </Typography>
            <img
              src={mask}
              alt="Сегментированное изображение"
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        )}    
      </Paper>
    </Container>
  );
}



export default App;