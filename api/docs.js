// api/docs.js
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    // Serve the HTML content
    res.setHeader('Content-Type', 'text/html');
    res.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ABRO TECH APIs - Docs</title>
        <link rel="stylesheet" href="/api/style.css"> <!-- Path to your CSS -->
      </head>
      <body>
        <header>
          <h1>Documentation for ABRO TECH APIS</h1>
        </header>
        <main>
          <section>
            <h2>API Endpoints</h2>
            <ul>
              <li><a href="/api/upload-file">Upload File</a></li>
              <li><a href="/api/chatgpt-4">ChatGPT API</a></li>
              <li><a href="/api/freefire-stalk">Free Fire Stalk API</a></li>
              <li><a href="/api/reminiByabro">Remini by ABRO</a></li>
            </ul>
          </section>
        </main>
      </body>
      </html>
    `);
    res.end();
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
