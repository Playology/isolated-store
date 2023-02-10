import {
  Rule,
  SchematicContext,
  Tree,
  url,
  mergeWith,
  move,
  apply,
  template,
  SchematicsException,
  chain,
  MergeStrategy
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

import {
  getAngularWorkspaceSchema,
  getAngularProject,
  tryGetRootStoreConfigFromProject,
  createFilterSpecsRule,
  createUpdateRootStoreModuleRule
} from '../schematic-utilities';

export default function featureStore(options: any): Rule {
  if(!options.storename) {
    options.storename = options.feature + 'Store';
  }
  console.log(options);
  return (tree: Tree, _context: SchematicContext) => {
    const angularWorkspace = getAngularWorkspaceSchema(tree);
    const project = getAngularProject(angularWorkspace, options.project);

    const rootStoreConfig = tryGetRootStoreConfigFromProject(tree, project.root);
    if (!rootStoreConfig) {
      throw new SchematicsException(
        // tslint:disable-next-line: max-line-length
        'Could not find .rootprojectrc, this project has not been initialised properly, please run the root-store schematic in this project first.'
      );
    }
    const featureModuleFolderPath = `${rootStoreConfig.rootStoreModuleFolderPath}/${strings.dasherize(options.storename as string)}`;
    const templateFiles = url('./files');
    const includeSpecs = !(options.nospec as boolean);
    const filterSpecsRule = createFilterSpecsRule(includeSpecs);
    const templateSource = apply(templateFiles, [
      filterSpecsRule,
      move(featureModuleFolderPath),
      template({
        ...options,
        ...strings
      })
    ]);
    const templateRule = mergeWith(templateSource, MergeStrategy.Default);
    const updateRootStoreModuleRule = createUpdateRootStoreModuleRule(rootStoreConfig, options.storename as string);

    return chain([templateRule, updateRootStoreModuleRule]);
  };
}
