import express from "express";
import { setApp } from "./setup-app";

// Создание приложения

export const app = express();
setApp(app);

// Порт приложения

const PORT = process.env.PORT || 5000; // PORT?

// Запуск приложения

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
