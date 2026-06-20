# Тренер — кабинет

Приложение для фитнес-тренеров: управление клиентами, расписание, тренировки, финансы.

## Запуск на сервере

```bash
git clone https://github.com/sychev23021983-design/trainer-cabinet
cd trainer-cabinet
cp .env.example .env
# Отредактируй .env
docker-compose up -d --build
```

## Адреса
- Frontend: http://your-server:8031
- Backend API: http://your-server:8030

## Стек
- Backend: Node.js + Express + Prisma + SQLite
- Frontend: React + Vite + TailwindCSS
- Deploy: Docker Compose
