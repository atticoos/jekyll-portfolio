
module.exports.getDeploymentName = function getDeploymentName () {
  var branch = process.env.CIRCLE_BRANCH;
  return branch.replace(/\//g, '.');
};
