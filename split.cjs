const fs = require('fs');
const content = fs.readFileSync('src/pages/QuestraNewApp.jsx', 'utf8');

if(!fs.existsSync('src/components/questra')) fs.mkdirSync('src/components/questra', { recursive: true });
if(!fs.existsSync('src/pages/questra')) fs.mkdirSync('src/pages/questra', { recursive: true });

const imports = `import React, { useState, useEffect, useRef } from 'react';\nconst BLUE="#2354F4",AMBER="#D97706",TEAL="#0891B2",VIOLET="#7C3AED",GREEN="#059669";\n\n`;

// Extract Global Style
const gMatch = content.match(/const G = \(\) => \([\s\S]*?\n\);\n/);
if(gMatch) {
  fs.writeFileSync('src/components/questra/G.jsx', `import React from 'react';\n${gMatch[0]}\nexport default G;\n`);
}

// Extract Functions
const funcs = [...content.matchAll(/function ([A-Z][a-zA-Z0-9_]*)\(.*?\)\{[\s\S]*?\n\}/g)];

funcs.forEach(m => {
  const name = m[1];
  if(name === 'App') return; // We skip App component
  
  let out = imports;
  if(name !== 'G' && name !== 'Nav' && name !== 'Footer' && name !== 'FAQItem') {
    out += `import Nav from '../../components/questra/Nav';\nimport Footer from '../../components/questra/Footer';\nimport G from '../../components/questra/G';\nimport FAQItem from '../../components/questra/FAQItem';\n\n`;
  }
  
  if (name === 'FAQItem') {
     out += `\n`; // FAQ doesn't need to import itself
  }

  out += m[0] + `\nexport default ${name};\n`;
  
  if(name.includes('Page')) {
      fs.writeFileSync(`src/pages/questra/${name}.jsx`, out);
  } else {
      fs.writeFileSync(`src/components/questra/${name}.jsx`, out);
  }
});

console.log('Successfully created components!');
