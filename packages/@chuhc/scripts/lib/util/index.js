/**
 * some fn
 */
const path = require('path');

const dirname = process.cwd();

exports.resolve = src => path.join(dirname, src);
