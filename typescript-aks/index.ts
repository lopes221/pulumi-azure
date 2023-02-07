import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure";

// Defining variables defined in Pulumi.dev.yaml file.
const config = new pulumi.Config();
const location = config.get("location");
const developer = config.get("developer");
const environment = config.get("environment");
const pillar = config.get("pillar");

// Define the default resource name
const defaultResourceGroup = "anderson_lopes-rg";

// Defining a set of tags
const tags = {
  Developer: `${developer}`,
  Environment: `${environment}`,
  Pillar: `${pillar}`,
};

// Defining a name to be used
const aksClusterName = config.get("clusterName") || `aks-pulumi-${environment}`;

// Creating AKS
// You can find all the specifications of the parameters below under the link below
// https://www.pulumi.com/registry/packages/azure/api-docs/containerservice/kubernetescluster/
// The are several parameters that once you change it will result on the build of a totally new aks cluster and destroying the previous

const aksCluster = new azure.containerservice.KubernetesCluster(
  `${aksClusterName}`,
  {
    name: `${aksClusterName}`,
    location: `${location}`,
    resourceGroupName: `${defaultResourceGroup}`,
    nodeResourceGroup: `MC_azure-pulumi_${aksClusterName}`,
    dnsPrefix: `aks-prfix-pulumi-${environment}`,
    defaultNodePool: {
      name: "default",
      nodeCount: 1,
      vmSize: "Standard_D2_v2",
    },
    identity: {
      type: "SystemAssigned",
    },
    tags: tags,
  }
);

export const kubeConfig = aksCluster.kubeConfigRaw;
console.log(kubeConfig);
