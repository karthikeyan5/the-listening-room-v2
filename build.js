const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const outDir = 'public/www';

// Create the output directory if it doesn't exist
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Copy index.html to the output directory and update script path
let htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
htmlContent = htmlContent.replace('/index.tsx', '/bundle.js');
fs.writeFileSync(path.join(outDir, 'index.html'), htmlContent);


// Build the TypeScript/React code
esbuild.build({
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: path.join(outDir, 'bundle.js'),
  define: {
    // Inject the environment variable from GitHub Secrets
    'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY)
  },
  loader: { '.tsx': 'tsx', '.ts': 'ts' },
  jsx: 'automatic',
}).catch(() => process.exit(1));

console.log(`Build complete. Output in ./${outDir}`);
