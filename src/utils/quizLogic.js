export const calculateBaseGain = (selectedDifficulty, selectedSubject) => {
  let baseGain = 10;
  if (selectedDifficulty?.id === 'intermediate') {
    if (selectedSubject?.id === 'lore') baseGain = 30;
    else if (selectedSubject?.id === 'tech') baseGain = 20;
    else baseGain = 15;
  } else if (selectedDifficulty?.id === 'advanced') {
    if (selectedSubject?.id === 'lore') baseGain = 50;
    else if (selectedSubject?.id === 'tech') baseGain = 30;
    else baseGain = 20;
  }
  return baseGain;
};
