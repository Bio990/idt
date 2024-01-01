# Servizio di Integrazione API NY Times Books e Google Books

Questo servizio Node.js utilizza Express e Axios per integrare le API di NY Times Books e Google Books, fornendo informazioni sulle liste di libri e i dettagli dei libri all'interno di tali liste.

## Prerequisiti

Prima di utilizzare questo servizio, è necessario ottenere una chiave API NY Times Books. 
Aggiorna la variabile `NYTIMES_API_KEY` nel file `.env` con le tue chiavi API.

## Ottenere una chiave API NY Times Books

1. Vai al sito https://developer.nytimes.com/apis e crea un account se non ne hai già uno. Dopo aver creato l'account, effettua l'accesso.
2. Nell'angolo in alto a destra, troverai il tuo username (indirizzo email). Facendo clic su di esso, si aprirà un menu a tendina. Seleziona l'opzione 'Apps'.
3. Nella nuova pagina, clicca su 'NEW APP' nell'angolo in alto a destra. Assegna un nome significativo alla tua app e abilita 'Books API' selezionandola e cliccando su 'Enable'. Infine, salva le modifiche.
4. Nella stessa pagina, troverai la sezione 'Your API Keys' con la chiave appena creata. Copia la chiave API e incollala nel file .env del tuo progetto.

## Installazione

```bash
# Clona il repository
git clone https://github.com/Bio990/idt.git

# Spostati nella cartella del progetto
cd idt

# Installa le dipendenze
npm install

# Avvia il server
npm start
```

## Endpoints

## 1. Elenco delle Liste NY Times Books
- **Endpoint:** `/nytimes/lists`
- **Metodo:** `GET`
- **Descrizione:** Restituisce un elenco di liste NY Times Books.
- **Esempio di Utilizzo:**
```bash
    curl http://localhost:3000/nytimes/lists
```

## 2. Dettagli dei Libri in una Lista NY Times Books
- **Endpoint:** `/nytimes/list/:listCode`
- **Metodo:** `GET`
- **Descrizione:** `Restituisce i dettagli dei libri all'interno di una     lista NY Times Books specificata.`
- **Parametri:** `listCode: Il codice della lista.`
- **Esempio di Utilizzo:**
```bash
    curl http://localhost:3000/nytimes/list/hardcover-fiction
```
