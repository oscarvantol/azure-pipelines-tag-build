# Azure Pipelines Tag Build

Tags the current build, other builds of the pipeline will be stripped from the tag.

```
steps:
- task: tag-build-task@0
  displayName: Add production tag
  inputs:
    uniqueTagValue: 'PRODUCTION'

```