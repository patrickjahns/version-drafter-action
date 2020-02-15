const core = require('@actions/core')
const log = require('release-drafter-github-app/lib/log')
const runnerIsActions = 'release-drafter-github-app/lib/utils'
const DEFAULT_CONFIG_NAME = 'version-drafter.yml'
const DEFAULT_CONFIG = Object.freeze({
  'major-labels': ['major'],
  'minor-labels': ['minor'],
  'patch-labels': ['patch']
})

module.exports.getConfig = async function getConfig({
  app,
  context,
  configName
}) {
  try {
    return await context.config(
      configName || DEFAULT_CONFIG_NAME,
      DEFAULT_CONFIG
    )
  } catch (error) {
    log({ app, context, error, message: 'Invalid config file' })
    if (runnerIsActions()) {
      core.setFailed('Invalid config file')
    }
    return null
  }
}
