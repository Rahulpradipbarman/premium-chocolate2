const fs = require('fs');
const path = require('path');

const historyDir = 'c:\\Users\\barma\\AppData\\Roaming\\Code\\User\\History';

function findAllFileHistory(targetName) {
  const folders = fs.readdirSync(historyDir);
  const matches = [];

  for (const folder of folders) {
    const entriesPath = path.join(historyDir, folder, 'entries.json');
    if (fs.existsSync(entriesPath)) {
      try {
        const content = fs.readFileSync(entriesPath, 'utf8');
        const data = JSON.parse(content);
        if (data.resource && data.resource.toLowerCase().endsWith(targetName.toLowerCase())) {
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

  matches.sort((a, b) => a.time - b.time); // oldest first
  return matches;
}

console.log("HOME.JSX:");
const homeMatches = findAllFileHistory('Home.jsx');
for(const match of homeMatches) {
    console.log("Time: " + match.time);
    console.log(fs.readFileSync(match.file, 'utf8').substring(0, 50));
}
