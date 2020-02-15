const { getVersionInfo } = require('release-drafter-github-app/lib/versions')

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
