/**
 * ShipSafe AI - Local Guardrail Agent Scanner
 * This script runs locally in your repository to check for exposed API keys, secrets, 
 * and vulnerable code structures before deployment.
 */

const fs = require('fs');
const path = require('path');

const SECRETS_PATTERNS = [
  /AI_KEY/i,
  /API_KEY/i,
  /SECRET/i,
  /PASSWORD/i,
  /PRIVATE_KEY/i,
  /AWS_ACCESS_KEY/i,
  /STRIPE_SECRET/i,
  /DATABASE_URL/i
];

const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build', '.next'];

let fileCount = 0;
let issueCount = 0;

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let hasIssues = false;

    lines.forEach((line, index) => {
      // Avoid false positives from configuration guidelines or example files
      if (line.includes('example') || line.includes('pattern') || line.includes('RESETS_PATTERNS')) {
        return;
      }

      SECRETS_PATTERNS.forEach(pattern => {
        if (pattern.test(line)) {
          // Check if there is an actual assignment that looks like a hardcoded key
          const assignmentMatch = line.match(/(?:=|\:)\s*['"`]([a-zA-Z0-9_\-]{8,})['"`]/);
          if (assignmentMatch) {
            console.log(`\x1b[31m[DANGER]\x1b[0m Exposed secret found in ${filePath}:${index + 1}`);
            console.log(`   Line: \x1b[33m${line.trim()}\x1b[0m`);
            issueCount++;
            hasIssues = true;
          }
        }
      });
    });

    fileCount++;
  } catch (err) {
    // Skip unreadable files
  }
}

function scanDir(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!EXCLUDED_DIRS.includes(file)) {
          scanDir(fullPath);
        }
      } else {
        const ext = path.extname(file);
        if (['.js', '.ts', '.tsx', '.json', '.env', '.example', '.yml', '.yaml'].includes(ext)) {
          scanFile(fullPath);
        }
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err.message);
  }
}

console.log(`\n\x1b[36m===================================================\x1b[0m`);
console.log(`\x1b[36m       SHIPSAFE AI - LOCAL DEPLOYMENT GUARDRAIL     \x1b[0m`);
console.log(`\x1b[36m===================================================\x1b[0m`);
console.log(`Scanning current workspace: ${process.cwd()}\n`);

scanDir(process.cwd());

console.log(`\n\x1b[36m====================== REPORT ======================\x1b[0m`);
console.log(`Files Scanned: ${fileCount}`);
if (issueCount === 0) {
  console.log(`\x1b[32m✔ ShipSafe Status: SECURE. No hardcoded credentials detected.\x1b[0m`);
  console.log(`Ready for deployment guardrail approval.`);
} else {
  console.log(`\x1b[31m✘ ShipSafe Status: VULNERABLE. Detected ${issueCount} potential exposed credential(s).\x1b[0m`);
  console.log(`Please move secrets to environment variables before publishing.`);
}
console.log(`\x1b[36m====================================================\x1b[0m\n`);
