import express from "express";
import { setApp } from "./setup-app";

// Создание приложения
export const app = express();
export default setApp(app);

// Порт приложения
const PORT = process.env.PORT || 5000;

// Запуск приложения: Строгая проверка на окружение Vercel
// Vercel ВСЕГДА автоматически внедряет переменную process.env.VERCEL
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
}