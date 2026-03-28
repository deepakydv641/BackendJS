const fs = require('fs');

const files = [
  'frontend/src/api/usersApi.js',
  'frontend/src/api/videosApi.js',
  'frontend/src/api/subscriptionsApi.js',
  'frontend/src/api/tweetsApi.js',
  'frontend/src/api/likesApi.js',
  'frontend/src/api/forgotPasswordApi.js',
  'frontend/src/api/commentsApi.js',
  'frontend/src/api/axios.js',
  'frontend/src/components/VideoCard.jsx',
  'frontend/src/pages/SearchPage.jsx'
];

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = content.replaceAll('https://sharewithall.onrender.com', 'http://localhost:8000');
    fs.writeFileSync(file, newContent);
    console.log('Updated:', file);
  } catch(e) {
    console.log('Error updating:', file, e.message);
  }
});

console.log('Done replacing URLs');
