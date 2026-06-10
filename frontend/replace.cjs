const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.md')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/Users/hp/.gemini/antigravity/scratch/questra-ai/src');
let changedCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  // Replace the full name
  newContent = newContent.replace(/Oracle Engine/g, 'Exam Generator');
  newContent = newContent.replace(/oracle engine/g, 'exam generator');
  newContent = newContent.replace(/Oracle engine/g, 'Exam generator');
  
  // Hindi translations
  newContent = newContent.replace(/ओरेकल इंजन/g, 'एग्जाम जनरेटर');
  newContent = newContent.replace(/ओरेकल/g, 'एग्जाम जनरेटर');
  
  // Replace isolated 'Oracle' labels
  newContent = newContent.replace(/label:\s*'Oracle'/g, "label: 'Exam Gen'");
  newContent = newContent.replace(/label:\s*"Oracle"/g, 'label: "Exam Gen"');
  
  // Replace references in arrays, like ["Oracle", "oracle"]
  newContent = newContent.replace(/'Oracle'/g, "'Exam Gen'");
  newContent = newContent.replace(/"Oracle"/g, '"Exam Gen"');
  
  // Other isolated places like Oracle Confidence -> AI Confidence
  newContent = newContent.replace(/Oracle Confidence/g, 'AI Confidence');
  newContent = newContent.replace(/Oracle Score/g, 'AI Score');
  newContent = newContent.replace(/oracleScore:\s*'Oracle Score'/g, "oracleScore: 'AI Score'");
  newContent = newContent.replace(/oracleConfidence:\s*'Oracle Confidence: \{confidence\}%'/g, "oracleConfidence: 'AI Confidence: {confidence}%'");

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
    console.log('Updated:', file);
  }
});
console.log('Total files changed:', changedCount);
