module.exports = function getCurrentTime(req) {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return new Date(parseInt(req.headers["x-test-now-ms"]));
  }
  return new Date();
};
