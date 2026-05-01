const fs = require('fs');
const path = require('path');

const historyDir = 'c:\\Users\\barma\\AppData\\Roaming\\Code\\User\\History';

function findAllFileHistory(fileName) {
  const folders = fs.readdirSync(historyDir);
  const matches = [];

  for (const folder of folders) {
    const entriesPath = path.join(historyDir, folder, 'entries.json');
    if (fs.existsSync(entriesPath)) {
      try {
        const content = fs.readFileSync(entriesPath, 'utf8');
        const data = JSON.parse(content);
        if (data.resource && data.resource.endsWith(fileName)) {
          if (data.entries && data.entries.length > 0) {
             for (const entry of data.entries) {
                 const filePath = path.join(historyDir, folder, entry.id);
                 matches.push({ file: filePath, time: entry.timestamp || 0 });
             }
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }

  matches.sort((a, b) => b.time - a.time); // newest first
  return matches;
}

console.log("HOME.JSX:");
const homeMatches = findAllFileHistory('Home.jsx');
for(const match of homeMatches) {
    console.log("Time: " + match.time + " Path: " + match.file);
    console.log(fs.readFileSync(match.file, 'utf8').substring(0, 150));
    console.log("---");
}

console.log("INDEX.CSS:");
const cssMatches = findAllFileHistory('index.css');
for(const match of cssMatches) {
    console.log("Time: " + match.time + " Path: " + match.file);
    console.log(fs.readFileSync(match.file, 'utf8').substring(0, 150));
    console.log("---");
}
