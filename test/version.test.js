const { incrementVersion } = require('../lib/version')

describe('increment version based on labels with default config', () => {
  const config = {
    'patch-labels': ['PATCH'],
    'minor-labels': ['MINOR'],
    'major-labels': ['MAJOR']
  }
  it('bumps by a patch number if there are no labels on PRs', () => {
    const lastRelease = {
      tag_name: '1.0.0',
      name: 'Some major release'
    }
    const prs = [{ labels: { nodes: [{ name: 'irrelevant' }] } }]
    const resolvedVersion = incrementVersion(lastRelease, prs, config)

    expect(resolvedVersion).toEqual('1.0.1')
  })
  it('bumps by a patch if there are only PATCH or other irrelevant labels on PRs', () => {
    const lastRelease = {
      tag_name: '1.0.0',
      name: 'Some major release'
    }
    const prs = [
      { labels: { nodes: [{ name: 'PATCH' }, { name: 'irrelevant' }] } },
      { labels: { nodes: [{ name: 'foobar' }] } }
    ]
    const resolvedVersion = incrementVersion(lastRelease, prs, config)

    expect(resolvedVersion).toEqual('1.0.1')
  })
  it('bumps by a minor version if there are only MINOR, PATCH or irrelevant labels on PRs', () => {
    const lastRelease = {
      tag_name: '1.0.0',
      name: 'Some major release'
    }
    const prs = [
      { labels: { nodes: [{ name: 'MINOR' }, { name: 'irrelevant' }] } },
      { labels: { nodes: [{ name: 'PATCH' }] } },
      { labels: { nodes: [{ name: 'foobar' }] } }
    ]
    const resolvedVersion = incrementVersion(lastRelease, prs, config)

    expect(resolvedVersion).toEqual('1.1.0')
  })
  it('bumps by a major version if there is a MAJOR label on any of the PRs', () => {
    const lastRelease = {
      tag_name: '1.0.0',
      name: 'Some major release'
    }
    const prs = [
      { labels: { nodes: [{ name: 'MINOR' }, { name: 'irrelevant' }] } },
      { labels: { nodes: [{ name: 'PATCH' }] } },
      { labels: { nodes: [{ name: 'MAJOR' }] } },
      { labels: { nodes: [{ name: 'foobar' }] } }
    ]
    const resolvedVersion = incrementVersion(lastRelease, prs, config)

    expect(resolvedVersion).toEqual('2.0.0')
  })
})

describe('increment version based on labels with default extended config', () => {
  const config = {
    'patch-labels': ['PATCH', 'bug', 'bugs'],
    'minor-labels': ['MINOR', 'enhancement'],
    'major-labels': ['MAJOR', 'breaking']
  }
  it('bumps by a patch number if there are no labels on PRs', () => {
    const lastRelease = {
      tag_name: '1.0.0',
      name: 'Some major release'
    }
    const prs = [{ labels: { nodes: [{ name: 'irrelevant' }] } }]
    const resolvedVersion = incrementVersion(lastRelease, prs, config)

    expect(resolvedVersion).toEqual('1.0.1')
  })

  it('bumps by a patch if there are only PATCH or other irrelevant labels on PRs', () => {
    const lastRelease = {
      tag_name: '1.0.0',
      name: 'Some major release'
    }
    const prs = [
      { labels: { nodes: [{ name: 'bug' }, { name: 'irrelevant' }] } },
      { labels: { nodes: [{ name: 'foobar' }] } }
    ]
    const resolvedVersion = incrementVersion(lastRelease, prs, config)

    expect(resolvedVersion).toEqual('1.0.1')
  })
  it('bumps by a minor version if there are only MINOR, PATCH or irrelevant labels on PRs', () => {
    const lastRelease = {
      tag_name: '1.0.0',
      name: 'Some major release'
    }
    const prs = [
      { labels: { nodes: [{ name: 'enhancement' }, { name: 'irrelevant' }] } },
      { labels: { nodes: [{ name: 'bug' }] } },
      { labels: { nodes: [{ name: 'foobar' }] } }
    ]
    const resolvedVersion = incrementVersion(lastRelease, prs, config)

    expect(resolvedVersion).toEqual('1.1.0')
  })
  it('bumps by a major version if there is a MAJOR label on any of the PRs', () => {
    const lastRelease = {
      tag_name: '1.0.0',
      name: 'Some major release'
    }
    const prs = [
      { labels: { nodes: [{ name: 'bug' }, { name: 'irrelevant' }] } },
      { labels: { nodes: [{ name: 'enhancement' }] } },
      { labels: { nodes: [{ name: 'breaking' }] } },
      { labels: { nodes: [{ name: 'foobar' }] } }
    ]
    const resolvedVersion = incrementVersion(lastRelease, prs, config)

    expect(resolvedVersion).toEqual('2.0.0')
  })
})
