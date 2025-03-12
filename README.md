# GovTech Student Management for Teachers

A system where teachers can perform administrative functions for their students. Teachers and students are identified by their email addresses.

This is a submission for the [GovTech Student Management for Teachers](https://gist.github.com/d3hiring/4d1415d445033d316c36a56f0953f4ef).

## 💻 Table of Contents

- 🔗 Deployments: TODO
- Database Diagram: TODO
- 🗄️ [Project Structure](#project-structure)
- ⚙️ [Installation](#installation)
- 🚄 [Run the App](#run-the-app)
- 🧪 [Run Unit Tests](#run-unit-tests): Incomplete
- 🧪 Run E2E Tests: TODO
- 🧱 [Technologies Used](#technologies-used)
- 📷 Preview: TODO
- 📝 [Assumptions](#assumptions)

<h2 id="project-structure">🗄️ Project Structure</h2>

```
src
├── api
│   ├── ...
│   ├── api.controller.ts
│   ├── api.module.ts
│   ├── api.service.ts
│   └── dtos
│       ├── create-teacher.dto.ts
│       └── register.dto.ts
├── app.module.ts
├── constants.ts
├── database
│   ├── database.module.ts
│   └── database.providers.ts
├── main.ts
├── students                            # Student resource
│   ├── student.entity.ts               # Entity defines Student
│   ├── student.providers.ts            # Provider provides Student Repository
│   ├── students.module.ts              # Module manages Services of Student
│   ├── students.service.spec.ts
│   └── students.service.ts             # Service implements actual logic
└── teachers                            # Teacher resource
    ├── teacher.entity.ts               # Entity defines Teacher
    ├── teacher.providers.ts            # Provider provides Teacher Repository
    ├── teachers.module.ts              # Module manages Services of Teacher
    ├── teachers.service.spec.ts
    └── teachers.service.ts             # Service implements actual logic
```

<h2 id="installation">⚙️ Installation</h2>
- Docker Desktop (Mac/Windows) / Docker Engine (Linux)
- docker compose

1. Clone the repository

   ```bash
   git clone git@github.com:trungnd3/dcube-teachers.git
   cd dcube-teachers
   ```

<h2 id="run-the-app">🚄 Run the App</h2>

This will start a development server on port 3000 by default.

First, got to the .env.dev file and change this variable to your liking

Then run this command

```bash
docker compose -f docker-compose-dev.yaml up --build -d
```

Your API is now ready to be served at http://localhost:3000

<h2 id="run-unit-tests">🧪 Run Unit Tests</h2>

```bash
npm run test:watch
```

<h2 id="technologies-used">🧱 Technologies Used</h2>

- **Backend**: NestJs, Typescript, TypeORM
- **Database**: MySQL
- **Build tool**: Docker Compose
- **Testing tool**: Jest

<h2 id="assumptions">📝 Assumptions</h2>

- When teacher register students, if one ore more students doesn't exist, that student(s) will be created.
- Suspending student is to remove student from the teacher's registration list, a teacher should present in the request.
