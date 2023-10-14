const express = require('express');
const app = express();
const QRCode = require('qrcode');
require('dotenv').config();
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const base64url = require('base64-url');
const shortid = require('shortid');

app.use(express.json());

// Create a JSON file to store URL mappings
const urlDatabaseFile = 'urls.json';

// Check if the JSON file exists; if not, create an empty object
if (!fs.existsSync(urlDatabaseFile)) {
  fs.writeFileSync(urlDatabaseFile, JSON.stringify({}), 'utf-8');
}

// Read the URL database
const urlDatabase = JSON.parse(fs.readFileSync(urlDatabaseFile, 'utf-8'));

app.post('/shortUrl', (req, res) => {
  const  url  = req.body.url;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const getUrl = getKeyByValue(urlDatabase, url);

if (getUrl !== null) {
  return res.json({shortUrl: getUrl});
} else {
  
  // Generate a short ID for the URL
  const shortId = shortid.generate();

  // Encode the short ID using base64url
  const shortUrl = base64url.encode(shortId);

  // Store the mapping in the database
  urlDatabase[shortUrl] = url;
  fs.writeFileSync(urlDatabaseFile, JSON.stringify(urlDatabase), 'utf-8');

  // Return the shortened URL
  res.json({ shortUrl });
}

});

app.post('/generateQrCode',(req, res) => {
  const requestedData = req.body;
   // Data you want to encode in the QR code
    const dataToEncode = requestedData.data;

    // Options for the QR code (size, error correction, etc.)
    const options = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: requestedData.margin,
      width: requestedData.width,
      height: requestedData.width,
      color:{
        dark: requestedData.qrColor,
        light: requestedData.backgroundColor
      }
    };

    // Generate the QR code
    QRCode.toDataURL( dataToEncode, options, (err, url) => {
      if (err) throw err;
      res.json({qrCode : url});
    });
});

app.get('/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;
  const longUrl = urlDatabase[shortUrl];

  if (!longUrl) {
    return res.status(404).json({ error: 'URL not found' });
  }

  // Redirect to the original URL
  res.redirect(longUrl);
});

// Define the path to your static files (CSS and JavaScript)
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function getKeyByValue(object, value) {
  for (const key in object) {
    if (object[key] === value) {
      return key;
    }
  }
  return null; // Return null if the value is not found
}
