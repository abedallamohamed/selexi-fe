# Selexi Inventory Frontend App

Vue 3 + Vite application with Docker.

## Configuration

### Environment Variables

The application uses the following environment variables:

- `VITE_API_BASE_URL`: Base URL for the backend APIs (default: `http://localhost:8000`)

To configure environment variables, create a `.env` file in the project root:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

**Note**: If not specified, the application will use the default value configured in `src/services/httpService.ts`.

## Setup and Launch

```bash
# Start the application
docker compose up -d --build

# View logs
docker logs selexi-fe

# Stop the application
docker compose down
```

## Access

- Application: http://localhost:5173