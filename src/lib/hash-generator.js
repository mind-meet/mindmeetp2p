/**
 * Generate a random hash
 * @param {number} length - The length of the hash
 * @returns {string} The generated hash
 */
export const generateRandomHash = (length=8) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';

  // Create an array of 32-bit unsigned integers
  const randomValues = new Uint32Array(length);
  
  // Generate random values
  window.crypto.getRandomValues(randomValues);
  randomValues.forEach((value) => {
    result += characters.charAt(value % charactersLength);
  });

  return result;
}