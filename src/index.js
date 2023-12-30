const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.NYTIMES_API_KEY;

app.get('/nytimes/lists', async (req, res) => {
  if (!apiKey) {
    return res.status(500).json({ error: 'Prima di utilizzare questo servizio, è necessario ottenere una chiave API NY Times Books. Una volta ottenuta la chiave, aggiorna la variabile \'NYTIMES_API_KEY\' nel file .env' });
  }

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

app.get('/nytimes/list/:listNameEncoded', async (req, res) => {
  if (!apiKey) {
    return res.status(500).json({ error: 'Prima di utilizzare questo servizio, è necessario ottenere una chiave API NY Times Books. Una volta ottenuta la chiave, aggiorna la variabile \'NYTIMES_API_KEY\' nel file .env' });
  }

  const listNameEncoded = req.params.listNameEncoded;

  try {
    const response = await axios.get(
      `https://api.nytimes.com/svc/books/v3/lists/${listNameEncoded}.json`,
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

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: `Errore durante la richiesta dei libri per la lista ${listNameEncoded}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
