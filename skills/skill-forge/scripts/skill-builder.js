const fs = require('fs');
const path = require('path');

const workspace = process.cwd();

// Collect all memory text
let allText = '';
const memoryFiles = [];
if (fs.existsSync('MEMORY.md')) memoryFiles.push('MEMORY.md');
const memDir = './memory';
if (fs.existsSync(memDir)) {
  memoryFiles.push(...fs.readdirSync(memDir).filter(f => f.endsWith('.md')).map(f => path.join(memDir, f)));
}

memoryFiles.forEach(file => {
  if (fs.existsSync(file)) {
    allText += fs.readFileSync(file, 'utf8').toLowerCase() + '\n';
  }
});

// Extract phrases (first 2-3 words of sentences)
const sentences = allText.split(/[.!?;]\s*/).filter(s => s.trim().length > 20);
const phraseFreq = {};
sentences.forEach(sent => {
  const words = sent.match(/\\b\\w+\\b/g) || sent.split(/\\s+/).filter(w => w.length > 3);
  if (words.length >= 2) {
    const bigram = words.slice(0,2).join(' ');
    const trigram = words.slice(0,3).join(' ');
    phraseFreq[bigram] = (phraseFreq[bigram] || 0) + 1;
    if (words.length >= 3) phraseFreq[trigram] = (phraseFreq[trigram] || 0) + 1;
  }
});

// Top patterns (count >1)
const topPatterns = Object.entries(phraseFreq)
  .filter(([,count]) => count > 1)
  .sort(([,a], [,b]) => b - a)
  .slice(0,5)
  .map(([phrase, count]) => ({phrase, count}));

console.log('Top repeated patterns:', JSON.stringify(topPatterns, null, 2));

// Generate SKILL.md for each
topPatterns.forEach(({phrase, count}) => {
  const skillName = phrase.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0,30);
  const skillDir = `skills/${skillName}`;
  if (fs.existsSync(skillDir)) return; // skip existing
  fs.mkdirSync(skillDir, { recursive: true });
  const skillPath = `${skillDir}/SKILL.md`;
  const template = `---
name: ${skillName}
description: Auto-generated for repeated pattern: "${phrase}" (${count}x)
---

# Workflow
Refine this template based on memory context for "${phrase}".

## Trigger
- User mentions "${phrase}"
- Frequency threshold met
`;
  fs.writeFileSync(skillPath, template);
  console.log(`\u2705 Generated: ${skillPath}`);
});
