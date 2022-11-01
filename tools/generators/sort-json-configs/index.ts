import {
  formatFiles,
  Tree,
  updateJson,
  visitNotIgnoredFiles,
} from '@nrwl/devkit';

function sortWorkspaceJson(tree: Tree): void {
  updateJson(tree, 'workspace.json', (json) => {
    json.projects = sortObjectKeys(json.projects);
    return json;
  });
}

function sortProjectJsons(tree: Tree): void {
  visitNotIgnoredFiles(tree, '', (path) => {
    if (!path.endsWith('project.json')) {
      return;
    }
    updateJson(tree, path, (json) => {
      if (json.implicitDependencies) {
        json.implicitDependencies = json.implicitDependencies.sort();
      }
      if (json.tags) {
        json.tags = json.tags.sort();
      }
      return json;
    });
  });
}

function sortPackageJson(tree: Tree): void {
  updateJson(tree, 'package.json', (json) => {
    json.scripts = sortObjectKeys(json.scripts);
    json.dependencies = sortObjectKeys(json.dependencies);
    json.devDependencies = sortObjectKeys(json.devDependencies);
    return json;
  });
}

function sortRootTsconfig(tree: Tree): void {
  updateJson(tree, 'tsconfig.base.json', (json) => {
    json.compilerOptions.paths = sortObjectKeys(json.compilerOptions.paths);
    return json;
  });
}

export default async function sortJsonConfigs(tree: Tree) {
  sortWorkspaceJson(tree);
  sortPackageJson(tree);
  sortRootTsconfig(tree);
  sortProjectJsons(tree);
  await formatFiles(tree);
}

function sortObjectKeys(obj: Record<string, unknown>) {
  const objKeys = Object.keys(obj);
  return ([] as string[])
    .concat(objKeys.sort())
    .reduce((sortedObj: Record<string, unknown>, key: string) => {
      if (objKeys.includes(key)) {
        sortedObj[key] = obj[key];
      }
      return sortedObj;
    }, Object.create(null));
}
