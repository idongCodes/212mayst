// file: scripts/generate-commits.js
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

try {
  // 1. Run git log to get the last 5 commit messages (subject only)
  // %s = subject, %cd = commit date, %h = abbreviated hash
  const output = execSync('git log -5 --pretty=format:"- %s (%cd)" --date=short').toString();

  // 2. Define where to save this data (inside the app folder so we can import it)
  const outputPath = path.join(__dirname, '../app/git-updates.json');

  // 3. Write the file
  fs.writeFileSync(outputPath, JSON.stringify({ commits: output }));
  
  console.log('✅ Success: git-updates.json generated with latest commits.');
} catch (error) {
  console.warn('⚠️ Warning: Could not run git log. (Is this a git repo?). Using fallback.');
  
  // Fallback for environments without git
  const outputPath = path.join(__dirname, '../app/git-updates.json');
  fs.writeFileSync(outputPath, JSON.stringify({ commits: "- General bug fixes and improvements." }));
}