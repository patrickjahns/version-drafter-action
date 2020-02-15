# version-drafter-action

[![License: ISC](https://img.shields.io/github/license/patrickjahns/version-drafter-action)](LICENSE)

[GitHub Action](https://github.com/features/actions) to determine the next [semantic version](https://semver.org/) based  on the github labels of merged pull requests
![Tests](https://github.com/patrickjahns/version-drafter-action/workflows/Tests/badge.svg?event=push)

## Usage

To use the action, create a yaml file ( i.e. `version.yml` ) in your `.github/workflows` folder 

```yaml

name: Update Releaseinfo
on:
  push:
    # branches to consider in the event; optional, defaults to all
    branches:
      - master

jobs:
  update_version:
    runs-on: ubuntu-latest
    steps:
      - name: calculate next version
        id: version
        uses: patrickjahns/version-drafter-action@master
        with:
          # (Optional) specify config name to use, relative to .github/. Default: version-drafter.yml
          # config-name: my-config.yml
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: echo calculated version
        run: |
          echo "version: ${{ steps.version.outputs.next-version }}"
``` 

### Output

The action will output the calculated next semantic version as `next-version`