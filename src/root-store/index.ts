import {
  Rule,
  SchematicContext,
  Tree,
  url,
  mergeWith,
  apply,
  template,
  move,
  MergeStrategy,
  chain
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { normalize } from 'path';

import {
  getAngularWorkspaceSchema,
  getAngularProject,
  createUpdateProjectRootModuleRule,
  createWriteRootStoreConfigFileRule,
  createNodePackageInstallRule
} from '../schematic-utilities';

export default function rootStore(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const angularWorkspace = getAngularWorkspaceSchema(tree);
    const project = getAngularProject(angularWorkspace, options.project);
    const projectRoot = `${project.sourceRoot}/${project.prefix}`;
    const projectFolderPath = normalize(strings.dasherize(`${projectRoot}/${options.name}`));

    const templateFiles = url('./files');
    const templateSource = apply(templateFiles, [
      move(projectFolderPath),
      template({
        ...options,
        ...strings
      })
    ]);

    const installNgRxStoreRule = createNodePackageInstallRule('@ngrx/store');
    const installNgRxEfectsRule = createNodePackageInstallRule('@ngrx/effects');
    const templateRule = mergeWith(templateSource, MergeStrategy.Default);
    const updateRootModuleRule = createUpdateProjectRootModuleRule(
      angularWorkspace,
      options.name as string,
      options.project
    );
    const writeRootStoreConfigRule = createWriteRootStoreConfigFileRule(project, {
      rootStoreModuleName: options.name as string,
      rootStoreModuleFilePath: `${project.sourceRoot}/${project.prefix}/${options.name}/${options.name}.module.ts`,
      rootStoreModuleFolderPath: `${project.sourceRoot}/${project.prefix}/${options.name}/`
    });
    return chain([
      installNgRxStoreRule,
      installNgRxEfectsRule,
      templateRule,
      updateRootModuleRule,
      writeRootStoreConfigRule
    ]);
  };
}
