// @ts-check
const { resolve, relative } = require('path');

/**
 * This utility uses the cache of the Nx dep graph to automatically create appropriate patterns
 * for the Tailwind purge config based on the projects within the Nx workspace that the Tailwind
 * project depends on.
 *
 * @param {string} tailwindConfigFilename The value of __filename in the tailwind.config.js file
 * @returns {string[]}
 */
exports.autoResolveWorkspaceDepsPurgePatterns = (tailwindConfigFilename) => {
  // @ts-ignore
  const nxDeps = require('.cache/nx/nxdeps.json');

  // Targets should be executed from the root of the workspace, so this seems like a reasonable assumption
  const workspaceRoot = process.cwd();
  const filenameRelativeToWorkspaceRoot = relative(
    workspaceRoot,
    tailwindConfigFilename
  );

  // Search the Nx dep graph cache for the file in order to figure out the node it belongs to
  let parentNodeName = null;
  for (const [nodeName, node] of Object.entries(nxDeps.nodes)) {
    for (const fileData of node.data.files) {
      if (fileData.file === filenameRelativeToWorkspaceRoot) {
        parentNodeName = nodeName;
        break;
      }
    }
    if (parentNodeName) {
      break;
    }
  }

  if (!parentNodeName) {
    throw new Error(
      'Could not find the current project on the cached Nx dep graph'
    );
  }

  // Recursively get all the dependencies of the node
  function addFirstPartyDependencies(dependencyNodeNames, parentNodeName) {
    const dependencies = nxDeps.dependencies[parentNodeName];
    if (!dependencies) {
      throw new Error(
        `Could not find any dependencies for the current project "${parentNodeName}" on the cached Nx dep graph`
      );
    }
    for (const dependency of dependencies) {
      const dependencyName = dependency.target;
      // Skip 3rd party deps from node_modules
      if (dependencyName.startsWith('npm:')) {
        continue;
      }
      dependencyNodeNames.add(dependencyName);
      // Get the dependencies of the dependencies
      addFirstPartyDependencies(dependencyNodeNames, dependencyName);
    }
  }

  const dependencyNodeNames = new Set();
  addFirstPartyDependencies(dependencyNodeNames, parentNodeName);

  // Convert dependency names to paths with patterns
  const purgePatterns = Array.from(dependencyNodeNames, (nodeName) => {
    const node = nxDeps.nodes[nodeName];
    // Include all .tsx files which are not storybook stories or unit test specs
    return resolve(
      workspaceRoot,
      `${node.data.root}/**/!(*.stories|*.spec).tsx`
    );
  });

  return purgePatterns;
};
