export const parseData = (data) => {
  const parsed = {};
  for (const subject in data) {
    parsed[subject] = {};
    for (const diff in data[subject]) {
      parsed[subject][diff] = []; // Always create the category to prevent crashes

      if (Array.isArray(data[subject][diff])) {
        data[subject][diff].forEach((q, idx) => {
          try {
            // Only load the question if it actually has text inside it
            if (q && Array.isArray(q) && q.length > 1) {
              parsed[subject][diff].push({
                id: `${subject}_${diff}_${idx}`,
                text: q[0] || "Question text missing",
                options: [
                  {text: q[1] || "A", isCorrect: true},
                  {text: q[2] || "B", isCorrect: false},
                  {text: q[3] || "C", isCorrect: false},
                  {text: q[4] || "D", isCorrect: false}
                ]
              });
            }
          } catch (err) {
            console.error(`Skipped a broken question in ${subject}`);
          }
        });
      }
    }
  }
  return parsed;
};
