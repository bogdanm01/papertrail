### Running the server with docker compose

```
docker compose -f docker-compose.local.yml up --build -d
```

### Executing drizzle commands

#### Push schema directly to the database

```
docker compose -f docker-compose.local.yml exec npm run drizzle:push:dev
```

#### Generate migrations

```
docker compose -f docker-compose.local.yml exec npm run drizzle:generate:dev
```

### Apply migrations

```
docker compose -f docker-compose.local.yml exec npx drizzle-kit migrate
```
