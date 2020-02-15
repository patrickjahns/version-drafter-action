const { getVersionInfo } = require('release-drafter-github-app/lib/versions')
// eslint-disable-next-line no-unused-vars
const inc = require('semver/functions/inc')
// eslint-disable-next-line no-unused-vars
const major = require('semver/functions/major')
// eslint-disable-next-line no-unused-vars
const minor = require('semver/functions/minor')
// eslint-disable-next-line no-unused-vars
const patch = require('semver/functions/patch')
// eslint-disable-next-line no-unused-vars
const parse = require('semver/functions/parse')
// eslint-disable-next-line no-unused-vars
const coerce = require('semver/functions/coerce')

module.exports.incrementVersion = (lastRelease, pullRequests, config) => {
  const nextVersion = getVersionInfo(lastRelease)
  const winningLabel = getWinningLabelFrom(pullRequests, config)
  switch (winningLabel) {
    case 'MINOR':
      return nextVersion.$NEXT_MINOR_VERSION.version
    case 'MAJOR':
      return nextVersion.$NEXT_MAJOR_VERSION.version
    default:
      return nextVersion.$NEXT_PATCH_VERSION.version
  }
}

const getWinningLabelFrom = (pullRequests, config) => {
  let winningLabel = 'PATCH'
  for (var i = 0; i < pullRequests.length; i++) {
    const pr = pullRequests[i]
    const labels = pr.labels.nodes
    for (var j = 0; j < labels.length; j++) {
      const label = labels[j]
      if (
        config['minor-labels']
          .map(label => label.toLowerCase())
          .includes(label.name.toLowerCase())
      ) {
        winningLabel = 'MINOR'
      }
      if (
        config['major-labels']
          .map(label => label.toLowerCase())
          .includes(label.name.toLowerCase())
      ) {
        return 'MAJOR'
      }
    }
  }
  return winningLabel
}
