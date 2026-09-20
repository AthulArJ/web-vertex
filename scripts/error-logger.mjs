import http from 'http';
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    console.log("\n\n=== BROWSER ERROR CAUGHT ===");
    console.log(body);
    console.log("============================\n\n");
    res.end('ok');
  });
}).listen(9999, () => {
  console.log("Listening on 9999 for browser errors...");
});
