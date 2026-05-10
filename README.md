<div align="center">

<!-- Animated title using SVG -->
<a href="https://github.com/onlineunknowns">
  <img src="https://readme-typing-svg.demolab.com?font=Sora&weight=700&size=36&duration=3000&pause=1000&color=0D9488&center=true&vCenter=true&multiline=true&width=700&height=100&lines=%F0%9F%A6%B7+Clinical Operating System;Smart+System+Clinic+Management" alt="Clinical Operating System" />
</a>

<br/>

<!-- Animated wave separator -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0D9488&height=80&section=header&fontSize=0" width="100%"/>

<br/>

<!-- Badges row 1 -->
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)

<!-- Badges row 2 -->
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://next-auth.js.org)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev)

<!-- Status badges -->
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Status](https://img.shields.io/badge/Status-Active_Development-orange?style=flat-square)]()

<br/>

> **The all-in-one SaaS platform for modern System clinics.**
> Manage patients, appointments, staff, multi-branch operations, and analytics — beautifully unified.

<br/>

<!-- Support & Social links -->
[![Buy Me A Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/onlineunknowns)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/201286016083)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/onlineunknown/)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🗺️ Project Architecture](#️-project-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🗂️ Project Structure](#️-project-structure)
- [🔐 Role System](#-role-system)
- [📡 API Design](#-api-design)
- [🗃️ Database Schema](#️-database-schema)
- [🧪 Development Roadmap](#-development-roadmap)
- [🤝 Contributing](#-contributing)
- [☕ Support](#-support)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🏥 Clinic Management
- ✅ Multi-branch / Multi-office support
- ✅ Role-based access control (5 roles)
- ✅ Real-time appointment scheduling
- ✅ Patient queue management
- ✅ Staff & doctor management

</td>
<td width="50%">

### 📊 Analytics & Reporting
- ✅ Revenue tracking per branch
- ✅ Appointment analytics
- ✅ Patient growth metrics
- ✅ Custom date range reports
- ✅ Exportable data (CSV)

</td>
</tr>
<tr>
<td width="50%">

### 👤 Patient Features
- ✅ Complete medical profile
- ✅ Treatment plan tracking
- ✅ X-ray & file management
- ✅ Private doctor notes
- ✅ Visit history timeline

</td>
<td width="50%">

### 🔒 Security & Auth
- ✅ NextAuth.js JWT authentication
- ✅ bcrypt password hashing
- ✅ Role-protected API routes
- ✅ Full audit log system
- ✅ Session expiry (8h work day)

</td>
</tr>
</table>

---

## 🗺️ Project Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║                        CLIENT LAYER                              ║
║                                                                  ║
║   ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  ║
║   │  Landing    │  │  Auth Pages  │  │   Console / Dashboard │  ║
║   │  index.tsx  │  │  signin.tsx  │  │  /console/[role]/...  │  ║
║   └─────────────┘  └──────────────┘  └───────────────────────┘  ║
║                                                                  ║
║   ┌──────────────────────────────────────────────────────────┐   ║
║   │                   COMPONENT LAYER                        │   ║
║   │  Nav  │  Hero  │  ModalHome  │  Combobox  │  Office      │   ║
║   │  User │  LogModal │ Office  │  Patient Cards  │  ...     │   ║
║   └──────────────────────────────────────────────────────────┘   ║
╠══════════════════════════════════════════════════════════════════╣
║                        API LAYER (tRPC)                          ║
║                                                                  ║
║   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   ║
║   │ patients   │ │appointment │ │  offices   │ │   users    │   ║
║   │  router    │ │  router    │ │  router    │ │  router    │   ║
║   └────────────┘ └────────────┘ └────────────┘ └────────────┘   ║
║                                                                  ║
║   ┌──────────────────────────────────────────────────────────┐   ║
║   │              src/server/auth.ts (NextAuth)               │   ║
║   │         JWT Callbacks │ Role Injection │ Audit Log       │   ║
║   └──────────────────────────────────────────────────────────┘   ║
╠══════════════════════════════════════════════════════════════════╣
║                       DATA LAYER (Prisma)                        ║
║                                                                  ║
║   User ──── Office ──── Patient ──── Appointment                 ║
║    │                       │                                     ║
║    └────────────────────── MedicalRecord                         ║
║                            TreatmentPlan                         ║
║                            PatientFile                           ║
║                            Note                                  ║
║                            Invoice                               ║
║                            AuditLog                              ║
║                                                                  ║
║   ┌──────────────────────────────────────────────────────────┐   ║
║   │                    PostgreSQL                            │   ║
║   └──────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════╝
```

### 🔄 Request Lifecycle

```
Browser Request
      │
      ▼
┌──────────────────┐
│  Next.js Router  │  ← Pages Router (src/pages/)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  NextAuth Guard  │  ← Checks JWT session + role
└────────┬─────────┘
         │ Authorized ✅
         ▼
┌──────────────────┐
│  React Component │  ← Renders UI
│  + React Query   │  ← Fetches data via tRPC
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  tRPC Router     │  ← Type-safe API
│  + Role Check    │  ← protectedProcedure
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Prisma ORM      │  ← Type-safe DB queries
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   PostgreSQL     │  ← Persistent storage
└──────────────────┘
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js_14-000?logo=nextdotjs&logoColor=white&style=flat-square) | Full-stack React framework (Pages Router) |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square) | End-to-end type safety |
| **Styling** | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square) | Utility-first CSS |
| **UI Components** | ![Shadcn](https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white&style=flat-square) | Accessible component primitives |
| **API** | ![tRPC](https://img.shields.io/badge/tRPC-2596BE?logo=trpc&logoColor=white&style=flat-square) | Type-safe client-server communication |
| **Auth** | ![NextAuth](https://img.shields.io/badge/NextAuth.js-000?logo=nextdotjs&logoColor=white&style=flat-square) | Authentication & session management |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=flat-square) | Primary relational database |
| **ORM** | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white&style=flat-square) | Type-safe database client |
| **Validation** | ![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white&style=flat-square) | Schema validation (client + server) |
| **State** | ![React Query](https://img.shields.io/badge/React_Query-FF4154?logo=reactquery&logoColor=white&style=flat-square) | Server state management |
| **Client State** | ![Zustand](https://img.shields.io/badge/Zustand-433E38?logo=react&logoColor=white&style=flat-square) | Lightweight client store |
| **Charts** | ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?logo=react&logoColor=white&style=flat-square) | Analytics & data visualization |
| **Forms** | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white&style=flat-square) | Performant form management |
| **Hosting** | ![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white&style=flat-square) | Deployment & edge functions |

</div>

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
postgresql >= 14
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/onlineunknowns/System-os.git
cd System-os

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/Clinical Operating System"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Database Setup

```bash
# Push schema to database
npx prisma db push

# Run seed (creates admin user + sample data)
npx prisma db seed

# Open Prisma Studio (visual DB browser)
npx prisma studio
```

### Run Development Server

```bash
npm run dev
# → http://localhost:3000
```

### Default Login (after seed)

```
Email:    admin@clinic.com
Password: Admin@123456
Role:     SUPER_ADMIN
```

---

## 🗂️ Project Structure

```
System-os/
│
├── 📁 prisma/
│   ├── schema.prisma          # Database models & relations
│   └── seed.ts                # Initial data seeder
│
├── 📁 src/
│   │
│   ├── 📁 styles/
│   │   └── globals.css        # Design tokens, base styles, dark mode
│   │
│   ├── 📁 pages/
│   │   ├── index.tsx          # 🌐 Landing / Marketing page
│   │   ├── _app.tsx           # ⚙️  Global providers & layout
│   │   │
│   │   ├── 📁 auth/
│   │   │   └── signin.tsx     # 🔐 Login page
│   │   │
│   │   └── 📁 console/
│   │       └── 📁 [role]/
│   │           ├── index.tsx               # 📊 Role dashboard
│   │           ├── 📁 office/
│   │           │   └── [officeId].tsx      # 🏥 Branch dashboard
│   │           └── 📁 patient/
│   │               └── [patientId].tsx     # 👤 Patient profile
│   │
│   ├── 📁 components/
│   │   ├── Nav.tsx            # 🧭 Sidebar + topbar navigation
│   │   ├── Hero.tsx           # 🎭 Landing hero section
│   │   ├── ModalHome.tsx      # 🗂️  Dashboard quick-action modals
│   │   ├── LogModal.tsx       # 📋 Activity log modal
│   │   ├── Office.tsx         # 🏢 Office card component
│   │   ├── User.tsx           # 👤 User/staff card component
│   │   └── Combobox.tsx       # 🔍 Async search/select
│   │
│   ├── 📁 server/
│   │   ├── auth.ts            # 🔒 NextAuth config + role callbacks
│   │   └── 📁 api/
│   │       ├── root.ts        # 🔌 Main tRPC router
│   │       ├── trpc.ts        # ⚙️  tRPC base + procedures
│   │       ├── context.ts     # 🗃️  Request context (session + db)
│   │       └── 📁 routers/
│   │           ├── patients.ts       # Patient CRUD + history
│   │           ├── appointments.ts   # Scheduling logic
│   │           ├── offices.ts        # Branch management
│   │           └── users.ts          # Staff management
│   │
│   ├── 📁 providers/
│   │   └── index.tsx          # Composed app providers
│   │
│   ├── 📁 hooks/
│   │   ├── useRole.ts         # Current user role helper
│   │   └── useOffice.ts       # Current office context
│   │
│   ├── 📁 types/
│   │   ├── next-auth.d.ts     # Session type augmentation
│   │   └── index.ts           # Shared TypeScript types
│   │
│   └── 📁 lib/
│       ├── prisma.ts          # Prisma singleton client
│       └── utils.ts           # cn() + shared utilities
│
├── tailwind.config.ts         # Extended Tailwind theme
├── .env.example               # Environment variable template
└── package.json
```

---

## 🔐 Role System

```
┌─────────────────────────────────────────────────────────┐
│                     ROLE HIERARCHY                       │
│                                                         │
│   👑 SUPER_ADMIN                                        │
│       └── Manage all clinics, billing, system config    │
│                                                         │
│       🏢 CLINIC_ADMIN                                   │
│           └── Manage own branch, staff, reports         │
│                                                         │
│           🩺 DOCTOR                                     │
│               └── View patients, add notes, treatments  │
│                                                         │
│               💼 RECEPTIONIST                           │
│                   └── Schedule appointments, add patients│
│                                                         │
│                   👤 PATIENT                            │
│                       └── View own data, book visits    │
└─────────────────────────────────────────────────────────┘
```

| Permission | 👑 | 🏢 | 🩺 | 💼 | 👤 |
|---|:---:|:---:|:---:|:---:|:---:|
| Manage all offices | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage staff | ✅ | ✅ | ❌ | ❌ | ❌ |
| View all patients | ✅ | ✅ | ✅ | ✅ | ❌ |
| Add medical notes | ✅ | ✅ | ✅ | ❌ | ❌ |
| Schedule appointments | ✅ | ✅ | ✅ | ✅ | ❌ |
| View own data | ✅ | ✅ | ✅ | ✅ | ✅ |
| View audit logs | ✅ | ✅ | ❌ | ❌ | ❌ |
| System settings | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 📡 API Design

All APIs are built with **tRPC** — fully type-safe, no REST boilerplate.

```typescript
// Example: Fetch paginated patients
const { data } = trpc.patients.getAll.useQuery({
  officeId: "office_123",
  search: "Ahmed",
  take: 10,
  skip: 0,
});

// Example: Create appointment (with type safety)
const createAppointment = trpc.appointments.create.useMutation({
  onSuccess: () => toast.success("Appointment scheduled!"),
});

createAppointment.mutate({
  patientId: "pat_456",
  doctorId: "usr_789",
  scheduledAt: new Date("2025-06-01T10:00:00"),
  duration: 60,
  type: "CHECKUP",
});
```

### Available Routers

| Router | Procedures |
|---|---|
| `patients` | `getAll`, `getById`, `create`, `update`, `delete`, `getHistory`, `addNote` |
| `appointments` | `getAll`, `getToday`, `create`, `updateStatus`, `reschedule`, `cancel` |
| `offices` | `getAll`, `getById`, `create`, `update`, `getStats` |
| `users` | `getStaff`, `invite`, `updateRole`, `deactivate` |

---

## 🗃️ Database Schema

```
┌──────────┐       ┌──────────────┐       ┌───────────────┐
│   User   │──────▶│    Office    │◀──────│  Appointment  │
│──────────│       │──────────────│       │───────────────│
│ id       │       │ id           │       │ id            │
│ name     │       │ name         │       │ scheduledAt   │
│ email    │       │ address      │       │ status        │
│ role     │       │ city         │       │ duration      │
│ password │       │ phone        │       │ type          │
└──────────┘       │ status       │       └───────────────┘
     │             └──────────────┘              │
     │                    │                      │
     ▼                    ▼                      ▼
┌──────────────┐   ┌──────────────┐      ┌──────────────┐
│  AuditLog    │   │   Patient    │      │ MedicalRecord│
│──────────────│   │──────────────│      │──────────────│
│ action       │   │ name         │      │ visitDate    │
│ entityType   │   │ phone        │      │ diagnosis    │
│ actorId      │   │ bloodType    │      │ treatment    │
│ metadata     │   │ allergies    │      │ prescription │
└──────────────┘   │ emergencyCtc │      └──────────────┘
                   └──────────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
        ┌──────────┐ ┌───────┐ ┌──────────────┐
        │TreatPlan │ │ Note  │ │ PatientFile  │
        │──────────│ │───────│ │──────────────│
        │ title    │ │content│ │ filename     │
        │ steps    │ │private│ │ fileType     │
        │ cost     │ └───────┘ │ url          │
        └──────────┘           └──────────────┘
```

---

## 🧪 Development Roadmap

```
Phase 1 — Foundation          [████████████░░] 85%
  ✅ Global UI & Design System
  ✅ Authentication (NextAuth + roles)
  ✅ Database Schema (Prisma)
  ✅ tRPC API setup
  🔄 Landing page (in progress)

Phase 2 — Core Dashboard      [████████░░░░░░] 55%
  ✅ Role-based dashboard
  ✅ Office management page
  🔄 Patient profile page
  ⬜ Appointment calendar view
  ⬜ Staff management

Phase 3 — Advanced Features   [██░░░░░░░░░░░░] 15%
  🔄 Analytics & Recharts integration
  ⬜ File uploads (X-rays, documents)
  ⬜ Invoice & billing system
  ⬜ Email notifications
  ⬜ Audit log viewer

Phase 4 — Polish & Launch     [░░░░░░░░░░░░░░] 0%
  ⬜ Mobile optimization
  ⬜ Performance audit
  ⬜ E2E tests (Playwright)
  ⬜ Docker deployment
  ⬜ Multi-language (AR/EN)
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "feat: add amazing feature"

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

### Commit Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Formatting changes
refactor: Code restructuring
test:     Adding tests
chore:    Maintenance
```

---

## ☕ Support

If this project helped you or your clinic, consider supporting the development:

<div align="center">

[![Buy Me A Coffee](https://img.shields.io/badge/Buy_Me_A_Coffee-%23FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/onlineunknowns)

**Connect with the developer:**

[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/201286016083)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/onlineunknown/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/onlineunknowns)

</div>

---

## 📄 License

```
MIT License — Copyright (c) 2025 onlineunknown

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software... [standard MIT text]
```

See [LICENSE](LICENSE) for full details.

---

<div align="center">

<!-- Animated footer wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0D9488&height=80&section=footer&fontSize=0" width="100%"/>

<br/>

<!-- Animated views counter -->
![Profile Views](https://komarev.com/ghpvc/?username=onlineunknowns&color=0D9488&style=flat-square&label=README+Views)

**Made with 🦷 and ❤️ by [onlineunknown](https://www.linkedin.com/in/onlineunknown/)**

*Building better System experiences, one commit at a time.*

</div>
