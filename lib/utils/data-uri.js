module.exports = function dataUri(data, type, base64 = false) {
  return `data:${type};base64,${
    base64 ? data : Buffer.from(data).toString('base64')
  }`;
};
