const fs = require('fs');
const path = require('path');

console.log('Running post-build script to modify index.html...');

const indexPath = path.join(__dirname, 'build', 'index.html');

try {
  // Read the index.html file
  let indexHTML = fs.readFileSync(indexPath, 'utf8');
  
  // Find the <head> tag and insert the CSP meta tag
  if (indexHTML.includes('<head>')) {
    const cspMetaTag = `<meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval'; font-src * data:; img-src * data:; connect-src *">`;
    
    // Insert CSP meta tag after the opening head tag
    indexHTML = indexHTML.replace('<head>', `<head>\n    ${cspMetaTag}`);
    
    // Write the modified content back to the file
    fs.writeFileSync(indexPath, indexHTML);
    console.log('Successfully added CSP meta tag to index.html');
  } else {
    console.error('Could not find <head> tag in index.html');
  }
} catch (error) {
  console.error('Error modifying index.html:', error);
} 