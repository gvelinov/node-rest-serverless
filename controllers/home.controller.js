// Default home route
exports.index = (req, res) => {
  res.send({content: "Hello API migration to serverless talk!"});
};