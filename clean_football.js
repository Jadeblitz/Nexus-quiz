import fs from 'fs';

let content = fs.readFileSync('src/data/quizData.js', 'utf8');

// The issue says "Manually re-write the Basketball and Football questions. Ensure the options are factually correct (Basketball = 5, Football = 11)."
// The basketball question is "How many players are on a standard basketball team on the court?" and options are "5", "6", "11", "7" and 5 is the correct answer. We fixed this already.
// The football question seems to be "How many players are typically on the field/court for one team in Football?" and there are multiple of these with randomized wrong answers, including one where the correct answer (first item) is "4" instead of "11"!
// Wait, looking at the grep output:
// "How many players are typically on the field/court for one team in Football?",
// "4", "1", "7", "5"
// "How many players are typically on the field/court for one team in Football?",
// "8", "11", "5", "10"
// "How many players are typically on the field/court for one team in Football?",
// "11", "1", "3", "5"

// We should replace all occurrences with a single proper question.

const footballPattern = /\s*\[\s*"How many players are typically on the field\/court for one team in Football\?",\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*"[^"]+"\s*\](?:,)?/g;

let count = 0;
content = content.replace(footballPattern, (match) => {
    count++;
    if (count === 1) {
        return `
      [
        "How many players are typically on the field/court for one team in Football?",
        "11",
        "10",
        "7",
        "5"
      ],`;
    }
    return "";
});

console.log(`Replaced ${count} football matches.`);

// Clean up trailing commas again
content = content.replace(/,\s*\]/g, '\n    ]');

fs.writeFileSync('src/data/quizData.js', content);
