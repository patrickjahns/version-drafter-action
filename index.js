const { getConfig } = require('./lib/config')
const log = require('release-drafter-github-app/lib/log')
const core = require('@actions/core')
const {
  isTriggerableBranch
} = require('release-drafter-github-app/lib/triggerable-branch')
const { findReleases } = require('release-drafter-github-app/lib/releases')
const {
  findCommitsWithAssociatedPullRequests
} = require('release-drafter-github-app/lib/commits')
const { incrementVersion } = require('./lib/version')

module.exports = app => {
  app.on('push', async context => {
    log({ app, context, message: 'init' })
    let config = await getConfig({
      app,
      context,
      configName: core.getInput('config-name')
    })
    if (config === null) return
    // TODO: allow to override major/minor/next labels via input vars
    // GitHub Actions merge payloads slightly differ, in that their ref points
    // to the PR branch instead of refs/heads/master
    const ref = process.env['GITHUB_REF'] || context.payload.ref

    const branch = ref.replace(/^refs\/heads\//, '')

    if (!isTriggerableBranch({ branch, app, context, config })) {
      return
    }

    // get latest release information
    const { lastRelease: lastRelease } = await findReleases({ app, context })

    // fetch upcoming pull requests
    const {
      pullRequests: mergedPullRequests
    } = await findCommitsWithAssociatedPullRequests({
      app,
      context,
      branch,
      lastRelease
    })

    // calculate new version based on template

    const nextVersion = incrementVersion(
      lastRelease,
      mergedPullRequests,
      config
    )
    log({ app, context, message: 'calculated next version: ' + nextVersion })
    core.setOutput('next-version', nextVersion)
  })
}
