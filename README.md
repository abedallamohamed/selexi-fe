# Selexi Frontend

Applicazione Vue 3 + Vite con Docker.

## Configurazione

### Variabili d'Ambiente

L'applicazione utilizza le seguenti variabili d'ambiente:

- `VITE_API_BASE_URL`: URL base per le API backend (default: `http://localhost:8000`)

Per configurare le variabili d'ambiente, crea un file `.env` nella root del progetto:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

**Nota**: Se non viene specificata, l'applicazione utilizzerà il valore di default configurato in `src/services/httpService.ts`.

## Setup e Avvio

```bash
# Avvia l'applicazione
docker compose up -d --build

# Visualizza i log
docker logs selexi-fe

# Ferma l'applicazione
docker compose down
```

## Accesso

- Applicazione: http://localhost:5173