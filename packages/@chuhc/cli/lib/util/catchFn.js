/**
 * catch throw error
 */
module.exports = (fn, ...args) => {
  try {
    fn(...args);
  } catch (err) {
    console.log(err);
  }
};
