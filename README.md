## 🗺️ QadamKadastr — Жер кадастрының автоматтандырылған ақпараттық жүйесі (ААЖ)

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Go](https://img.shields.io/badge/Go-1.22-00ADD8?logo=go&logoColor=white)](https://golang.org/)
[![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-336791?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**QadamKadastr** — Қосшы қаласы (Тайтөбе ауылы) бойынша жер телімдерін электрондық картада визуализациялауға, кадастрлық деректерді есепке алуға және азаматтарға ашық қолжетімділік беруге арналған толыққанды геоақпараттық веб-платформа (ААЖ / АИС ГКН).

---

### 📑 Жоба талаптарының орындалуы (Assignment Checklist)

| № | Талап (Requirement) | Жүзеге асырылуы (Implementation) |
|---|---|---|
| **1** | **Басты бет** | Жүйенің мақсаты, миссиясы, негізгі көрсеткіштер (KPI) карточкалары және жылдам өту батырмалары. |
| **2** | **Навигациялық мәзір** | Бетті қайта жүктемей (SPA) жұмыс істейтін жоғарғы мәзір + 🇰🇿 ҚАЗ / 🇷🇺 РУС тіл ауыстырғышы. |
| **3** | **Ақпараттық бөлім** | Мемлекеттік жер кадастры, кадастрлық нөмір құрылымы (01-001-001-005) және ГАЖ/GIS технологиялары. |
| **4** | **Деректер бөлімі** | Жер учаскелерінің интерактивті кестесі, заңды мәртебелері (жеке меншік, мемлекеттік, бос), «Картадан көру» батырмасы. |
| **5** | **Іздеу функциясы** | Кадастрлық нөмір немесе мекенжай бойынша жылдам іздеу және картаны автоматты түрде жылжыту (`flyTo`). |

---

### 🏗️ Жүйе архитектурасы (System Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                    Клиент (Frontend)                        │
│                 React 19 + Leaflet + Vite                   │
│             [Хостинг: Vercel CDN Global Edge]               │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Сервер (Backend)                         │
│             Go 1.22 (net/http) + CORS Middleware            │
│         [Хостинг: Render (Docker Multi-Stage Build)]        │
└──────────────────────────────┬──────────────────────────────┘
                               │ PostgreSQL Wire Protocol (TLS/SSL)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Дерекқор (Database)                       │
│             Neon Serverless PostgreSQL (JSONB)              │
│       [20 жер учаскесі, WGS84 векторлық полигондары]         │
└─────────────────────────────────────────────────────────────┘
```

---

### ✨ Негізгі мүмкіндіктер (Key Features)

- **🛰️ Интерактивті ГАЖ/GIS Карта:** OpenStreetMap және Leaflet арқылы WGS84 координаттық полигондарын көрсету.
- **💬 In-Map Speech-Bubble Popups:** Учаскені картадан басқанда тікелей полигон үстінен ашылатын ресми модальді терезе.
- **📱 Floating Drawer & Mobile Bottom Sheet:**
  - Компьютерде: Картаның оң жақ жоғарғы бұрышында ақпараттық панель.
  - Смартфондарда: Google Maps / 2GIS стилінде төменнен сырғып шығатын ыңғайлы Bottom Sheet.
- **🌐 Толық екітілділік (Bilingual KZ / RU):** Барлық мәзір, батырмалар, кесте және 20 жер учаскесі қазақ және орыс тілдеріне толық бейімделген.
- **🔍 Жедел серверлік және клиенттік іздеу:** Кадастр нөмірі немесе көше атауы бойынша бір сәтте сүзу.
- **🐳 Жеңіл Docker Контейнері:** Go бағдарламасын екі кезеңді (Multi-stage) компиляциялап, өлшемі небары **~15 МБ** болатын қауіпсіз контейнер құру.

---

### 📁 Жоба құрылымы (Project Structure)

```text
QadamKadastr/
├── backend/
│   ├── data/
│   │   └── seed.sql          # 20 учаскенің схемасы мен бастапқы мәліметтері
│   ├── models/
│   │   └── parcel.go         # Go Struct (JSON & DB модельдері)
│   ├── Dockerfile            # Render-ге арналған Multi-stage Docker құрылымы
│   ├── go.mod                # Go тәуелділіктері
│   ├── go.sum                # Хэш тексерулері
│   ├── main.go               # HTTP сервер, роутинг, CORS және Neon қосылымы
│   └── .env                  # Дерекқор құпиялары (git-ке жүктелмейді)
│
├── frontend/
│   ├── src/
│   │   ├── assets/           # Иконкалар мен графикалар
│   │   ├── componets/
│   │   │   ├── About.jsx     # Ақпараттық бөлім (ГАЖ және Кадастр)
│   │   │   ├── Home.jsx      # Басты бет (Hero, Статистика)
│   │   │   ├── Mapview.jsx   # Интерактивті карта + In-map Popup + Drawer
│   │   │   ├── Navbar.jsx    # Навигация + Тіл ауыстырғыш
│   │   │   └── ParcelsTable.jsx # Жер тізілімі кестесі
│   │   ├── data/             # Жергілікті мок деректер
│   │   ├── translations.js   # KZ / RU локализация сөздігі
│   │   ├── App.css           # Заманауи мемлекеттік ГАЖ дизайны + Мобильді стильдер
│   │   ├── App.jsx           # Негізгі компонент және API байланысы
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env                  # VITE_API_URL айнымалысы
│
├── .gitignore                # Құпия .env файлдарын қорғау
└── README.md
```

---

### 🚀 Жергілікті іске қосу (Local Setup)

#### 1. Талаптар:
- **Node.js:** v18+ 
- **Go:** v1.22+
- **Neon PostgreSQL:** Белсенді дерекқор аккаунты

#### 2. Бэкендті іске қосу:
```bash
cd backend

# Тәуелділіктерді орнату
go mod download

# Серверді бастау (Neon дерекқорымен автоматты байланысады)
go run main.go
```
*Сервер `http://localhost:8080` мекенжайында ашылады.*

#### 3. Фронтендті іске қосу:
```bash
cd frontend

# Тәуелділіктерді орнату
npm install

# Әзірлеу серверін қосу
npm run dev
```
*Браузерде `http://localhost:5173` ашыңыз.*

---

### 🌐 Бұлтқа орналастыру (Cloud Deployment)

#### 1. Бэкенд (Render + Docker):
1. [Render.com](https://render.com) платформасында жаңа **Web Service** құрыңыз.
2. Түбірлік қалта ретінде **`backend`** көрсетіңіз.
3. Ортасы ретінде **Docker** таңдаңыз.
4. **Environment Variables** бөліміне Neon деректерін қосыңыз (`PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGSSLMODE=require`).

#### 2. Фронтенд (Vercel):
1. [Vercel.com](https://vercel.com) платформасында репозиторийді импорттаңыз.
2. Түбірлік қалта ретінде **`frontend`** таңдаңыз.
3. Орта айнымалысын қосыңыз:
   - `VITE_API_URL` = `https://<сіздің-render-сілтемеңіз>.onrender.com`
4. **Deploy** батырмасын басыңыз.

---

### 📄 Лицензия

Бұл жоба [MIT](LICENSE) лицензиясы бойынша қолжетімді.
