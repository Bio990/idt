const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.NYTIMES_API_KEY;

// i risultati restano memorizzati in cache per 5 minuti
const cache = new NodeCache({ stdTTL: 300 });

app.use((req, res, next) => {
  if (!apiKey) {
    return res.status(500).json({ error: 'Prima di utilizzare questo servizio, è necessario ottenere una chiave API NY Times Books. Una volta ottenuta la chiave, aggiorna la variabile \'NYTIMES_API_KEY\' nel file .env' });
  }

  next();
})

app.get('/nytimes/lists', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.nytimes.com/svc/books/v3/lists/names.json',
      { params: { 'api-key': apiKey } }
    );

    res.json(
      response.data.results.map(list => ({
        name: list.list_name,
        code: list.list_name_encoded
      }))
    );

  } catch (error) {
    res.status(500).json({ error: 'Errore durante la richiesta delle liste NY Times' });
  }
});

app.get('/nytimes/list/:listCode', async (req, res) => {
  const listCode = req.params.listCode;

  // utilizzo la cache per velocizzare le successive chiamate
  const cacheKey = `nytimes:${listCode}`;
  const cachedResponse = cache.get(cacheKey);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  try {
    const response = await axios.get(
      `https://api.nytimes.com/svc/books/v3/lists/${listCode}.json`,
      { params: { 'api-key': apiKey } }
    );

    const books = await Promise.all(response.data.results.books.map(async book => {
      const volume = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.primary_isbn13}&fields=items(volumeInfo/previewLink)`);
      
      return {
        title: book.title,
        author: book.author,
        description: book.description,
        googleBooksPreviewLink: volume.data.items[0]?.volumeInfo?.previewLink
      }
    }));

    // salvo il rsultato nella cache
    cache.set(cacheKey, books);

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: `Errore durante la richiesta dei libri per la lista ${listCode}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
