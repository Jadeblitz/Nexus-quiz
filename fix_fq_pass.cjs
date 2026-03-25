const fs = require('fs');

let gameContext = fs.readFileSync('src/context/GameContext.jsx', 'utf8');

// I need to make sure finishQuiz in GameContext checks the proper pass threshold before incrementing passes.
const regex = /const isPass = finalScore >= \(isTimeAttack \? 14 : 7\);/;
if (!regex.test(gameContext)) {
   // Try an alternative search string
   const altRegex = /const passThreshold = isTimeAttack \? 14 : 7;\n    const isPass = finalScore >= passThreshold;/;
   if (altRegex.test(gameContext)) {
     console.log("Pass threshold already present and correct.");
   } else {
     // I will manually look at finishQuiz.
     console.log("Not found. Check manually.");
   }
} else {
   console.log("Found inline pass check");
}
