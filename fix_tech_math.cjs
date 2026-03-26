const fs = require('fs');

let content = fs.readFileSync('src/data/quizData.js', 'utf8');

const regex = /export const rawQuizData = (\{[\s\S]*?\});/;
const match = content.match(regex);
if (match) {
    const rawDataStr = match[1];
    const getRawData = new Function(`return ${rawDataStr}`);
    let rawData = getRawData();

    // Purge baby math in tech > foundational
    rawData['tech']['foundational'] = [
        ["What is the sum of the interior angles of a triangle?", "180 degrees", "90 degrees", "360 degrees", "270 degrees"],
        ["What is the value of Pi (π) to two decimal places?", "3.14", "3.16", "3.12", "3.18"],
        ["What is the formula for the area of a rectangle?", "Length × Width", "Base × Height / 2", "π × radius²", "2 × Length + 2 × Width"],
        ["In a right-angled triangle, what theorem relates the lengths of the sides a, b, and c?", "Pythagorean Theorem", "Fermat's Last Theorem", "Binomial Theorem", "Fundamental Theorem of Calculus"],
        ["What is the square root of 144?", "12", "14", "16", "10"],
        ["What is the perimeter of a circle called?", "Circumference", "Diameter", "Radius", "Chord"],
        ["Solve for x: 3x - 7 = 14.", "x = 7", "x = 5", "x = 9", "x = 6"],
        ["What is 15% of 200?", "30", "25", "15", "35"],
        ["If a car travels at 60 km/h, how far will it go in 2.5 hours?", "150 km", "120 km", "180 km", "100 km"],
        ["Which polygon has exactly five sides?", "Pentagon", "Hexagon", "Heptagon", "Octagon"]
    ];

    const newRawDataStr = JSON.stringify(rawData, null, 2);
    content = content.replace(rawDataStr, newRawDataStr);
    fs.writeFileSync('src/data/quizData.js', content);
    console.log('Math foundational purged.');
}
