// Calculate result number for Teer game
export const calculateResult = (totalHits) => {
  // In Teer game, the result is the last two digits of the total hits
  const result = totalHits % 100;
  // Format as two digits, e.g., "05" for 5
  return result.toString().padStart(2, '0');
};
