# Usa l'immagine ufficiale di Node.js
FROM node:22-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice
COPY . .

# Esponi la porta 5173 (porta di default di Vite)
EXPOSE 5173

# Comando per installare dipendenze e avviare il server
CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0"]
