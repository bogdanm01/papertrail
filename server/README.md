## Running the Server

Start the server using Docker Compose:

```bash
docker compose -f docker-compose.local.yml up --build -d
```

This will build the images (if needed) and run the containers in the background.  

---

## Database & Drizzle ORM

### Push schema directly to the database

```bash
docker compose -f docker-compose.local.yml exec backend npm run drizzle:push:dev
```

---

### Generate migrations

```bash
docker compose -f docker-compose.local.yml exec backend npm run drizzle:generate:dev
```

---

### Apply migrations

```bash
docker compose -f docker-compose.local.yml exec backend npx drizzle-kit migrate
```

--- 
