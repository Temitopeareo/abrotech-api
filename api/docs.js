// api/docs.js
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ABRO TECH APIS</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <header>
        <div class="menu-bar">
          <div class="hamburger" onclick="toggleMenu()">
            &#9776;
          </div>
          <h1>ABRO TECH APIS</h1>
        </div>
      </header>
      <aside id="sideMenu" class="side-menu">
        <nav>
          <ul>
            <li><a href="#ai">Ai APIs</a></li>
            <li><a href="#fun">Fun APIs</a></li>
            <li><a href="#anime">Anime APIs</a></li>
            <li><a href="#search">Search APIs</a></li>
            <li><a href="#stalker">Stalker APIs</a></li>
            <li><a href="#uploader">Uploader APIs</a></li>
          </ul>
        </nav>
      </aside>
      <main>
        <section>
          <h2>Welcome to ABRO TECH APIS</h2>
          <p>Your go-to hub for amazing APIs, serving everything from AI to Anime!</p>
        </section>
      </main>
      <script>
        function toggleMenu() {
          var menu = document.getElementById('sideMenu');
          if (menu.style.width === '250px') {
            menu.style.width = '0';
          } else {
            menu.style.width = '250px';
          }
        }
      </script>
    </body>
    </html>
  `);
  res.end();
};
