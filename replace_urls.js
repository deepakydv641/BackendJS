const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\deepa\\OneDrive\\BackendJS\\frontend\\src';

const filesToUpdate = [
  'api/videosApi.js',
  'api/usersApi.js',
  'api/subscriptionsApi.js',
  'api/likesApi.js',
  'api/commentsApi.js',
  'api/axios.js',
  'api/tweetsApi.js',
  'pages/SearchPage.jsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace all occurrences of '/api/v1/' with 'https://sharewithall.onrender.com/api/v1/'
    // The negative lookbehind ensures we don't double replace if it's already there
    content = content.replace(/(?<!https:\/\/sharewithall\.onrender\.com)\/api\/v1\//g, 'https://sharewithall.onrender.com/api/v1/');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
