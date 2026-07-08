import fs from 'fs';

const content = fs.readFileSync('src/components/FinWordleData.ts', 'utf-8');

const matches = [...content.matchAll(/{ word: { id: "([^"]+)", en: "([^"]+)" }, clue: { id: "([^"]+)", en: "([^"]+)" } }/g)];

const uniqueWords = new Map();

for (const match of matches) {
  uniqueWords.set(match[1], {
    en_word: match[2],
    id_clue: match[3],
    en_clue: match[4]
  });
}

console.log(`Found ${uniqueWords.size} unique words.`);
for (const [id_word, data] of uniqueWords.entries()) {
  console.log(`${id_word} (${data.en_word}):\n  ID: ${data.id_clue}\n  EN: ${data.en_clue}`);
}
