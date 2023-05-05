import tl = require('azure-pipelines-task-lib/task');
import * as rm from 'typed-rest-client';
import btoa from 'btoa';
import { Build } from "azure-devops-extension-api/Build";

async function run() {
    const uniqueTagValue: string = tl.getInput('uniqueTagValue', true) || "EXAMPLE-TAG";
    const buildDefinitionId = tl.getVariable('System.DefinitionId');
    const accessToken = tl.getVariable('System.AccessToken');
    const collectionUri = tl.getVariable('System.CollectionUri');
    const teamProject = tl.getVariable('System.TeamProject');
    const buildId = tl.getVariable('Build.BuildId');

    const client = new rm.RestClient('', `${collectionUri}${teamProject}/_apis`, undefined, { headers: { 'Authorization': 'Basic ' + btoa(":" + accessToken) } });
    const bwtResponse = await client.get(`build/builds?definitions=${buildDefinitionId}&tagFilters=${uniqueTagValue}&api-version=7.0`);
    const buildsWithTag = (bwtResponse.result as any).value as Build[];

    for (let i = 0; i < buildsWithTag.length; i++) {
        await client.del(`build/builds/${buildsWithTag[i].id}/tags/${uniqueTagValue}/?api-version=7.0`);
    }

    await client.replace(`build/builds/${buildId}/tags/${uniqueTagValue}/?api-version=7.0`, {});
}

run();
