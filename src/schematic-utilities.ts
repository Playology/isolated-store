import { strings } from '@angular-devkit/core';
import { Tree, SchematicsException, Rule, SchematicContext, TaskId, filter, noop } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { NodePackageTaskOptions } from '@angular-devkit/schematics/tasks/package-manager/options';
import { SourceFile, Node, SyntaxKind, createSourceFile, ScriptTarget } from 'typescript';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';

import { IRootStoreConfig } from './root-store-config';

export function containsImportDeclaration(file: SourceFile, tokenName: string, filePath: string): boolean {
  let result: boolean = false;
  file.forEachChild((child: Node) => {
    if (child.kind === SyntaxKind.ImportDeclaration) {
      const childText = child.getFullText();
      if (childText.includes(tokenName) && childText.includes(filePath)) {
        result = true;
      }
    }
  });
  return result;
}

export function containsNgModuleImport(file: SourceFile, moduleToken: string): boolean {
  let result: boolean = false;
  file.forEachChild((node: Node) => {
    if (node.kind === SyntaxKind.ClassDeclaration) {
      node.forEachChild((classChild: Node) => {
        if (classChild.kind === SyntaxKind.Decorator) {
          classChild.forEachChild((moduleDeclaration: Node) => {
            moduleDeclaration.forEachChild((objectLiteral: Node) => {
              objectLiteral.forEachChild((property: Node) => {
                if (property.getFullText().includes('imports')) {
                  property.forEachChild((token: Node) => {
                    if (token.getFullText().includes(moduleToken)) {
                      result = true;
                    }
                  });
                }
              });
            });
          });
        }
      });
    }
  });

  return result;
}

export function createFilterSpecsRule(includeSpecs: boolean) {
  return includeSpecs ? noop() : filter((path: string) => !path.endsWith('spec.ts'));
}

export function createNodePackageInstallRule(packageId: string, callback?: (taskId: TaskId) => void): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    const packageJsonPath = '/package.json';
    const packageJson = openAsSourceFile(tree, packageJsonPath);
    let isPackageInstalled = false;

    packageJson.forEachChild((node: Node) => {
      if (node.kind === SyntaxKind.ExpressionStatement) {
        node.forEachChild((o: any) => {
          o.forEachChild((p: any) => {
            if (p.getFullText().includes('dependencies')) {
              p.forEachChild((d: any) => {
                if (d.getFullText().includes(packageId)) {
                  _context.logger.info(`${packageId} is already installed`);
                  isPackageInstalled = true;
                }
              });
            }
          });
        });
      }
    });

    if (!isPackageInstalled) {
      const options = <NodePackageTaskOptions>{
        packageName: packageId
      };
      const taskId = _context.addTask(new NodePackageInstallTask(options));
      if (typeof callback === 'function') {
        callback(taskId);
      }
      _context.logger.info(`Installing ${packageId}`);
    }

    return tree;
  };
}

export function createUpdateProjectRootModuleRule(
  workspace: WorkspaceSchema,
  moduleName: string,
  projectName?: string
): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    if (!projectName) {
      projectName = workspace.defaultProject as string;
    }
    const project = getAngularProject(workspace, projectName);
    const moduleFilePrefix = project.projectType === 'application' ? project.prefix : projectName;
    const rootModulePath = `${project.sourceRoot}/${project.prefix}/${moduleFilePrefix}.module.ts`;

    const importModuleClassName = strings.classify(moduleName);
    const importDasherizePathName = strings.dasherize(moduleName);
    const moduleToken = `${importModuleClassName}Module`;
    const moduleFileName = `${importDasherizePathName}.module`;

    const importContent = `import { ${moduleToken} } ` + `from './${importDasherizePathName}/${moduleFileName}';\n`;

    const moduleFile = openAsSourceFile(tree, rootModulePath);

    const importsModule = containsImportDeclaration(moduleFile, moduleToken, moduleFileName);
    const importsToken = containsNgModuleImport(moduleFile, moduleToken);

    if (!importsModule && !importsToken) {
      const lastImportEndPos = getNextImportDeclarationPosition(moduleFile);
      const importArrayEndPos = getNextNgModuleImportPosition(moduleFile);

      const rec = tree.beginUpdate(rootModulePath);
      rec.insertLeft(lastImportEndPos, importContent);
      rec.insertLeft(importArrayEndPos, `, ${moduleToken}`);
      tree.commitUpdate(rec);
    }
    return tree;
  };
}

export function createUpdateRootStoreModuleRule(
  rootStoreConfig: IRootStoreConfig,
  featureStoreModuleName: string
): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    const importModuleClassName = strings.classify(featureStoreModuleName);
    const importDasherizePathName = strings.dasherize(featureStoreModuleName);
    const moduleToken = `${importModuleClassName}Module`;
    const moduleFileName = `${importDasherizePathName}.module`;

    const importContent = `import { ${moduleToken} } ` + `from './${importDasherizePathName}/${moduleFileName}';\n`;

    const moduleFile = openAsSourceFile(tree, rootStoreConfig.rootStoreModuleFilePath);

    const importsModule = containsImportDeclaration(moduleFile, moduleToken, moduleFileName);
    const importsToken = containsNgModuleImport(moduleFile, moduleToken);

    if (!importsModule && !importsToken) {
      const lastImportEndPos = getNextImportDeclarationPosition(moduleFile);
      const importArrayEndPos = getNextNgModuleImportPosition(moduleFile);

      const rec = tree.beginUpdate(rootStoreConfig.rootStoreModuleFilePath);
      rec.insertLeft(lastImportEndPos, importContent);
      rec.insertLeft(importArrayEndPos, `, ${moduleToken}`);
      tree.commitUpdate(rec);
    }
    return tree;
  };
}

export function createUpdateWorkspaceRule(workspace: WorkspaceSchema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const workspaceContent = JSON.stringify(workspace, null, 2);
    _tree.overwrite('/angular.json', workspaceContent);
    return _tree;
  };
}

export function createWriteFileRule(path: string, content: string): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    if (_tree.exists(path)) {
      _tree.overwrite(path, content);
    } else {
      _tree.create(path, content);
    }
    return _tree;
  };
}

export function createWriteRootStoreConfigFileRule(
  project: WorkspaceProject,
  config: IRootStoreConfig
): Rule {
  const path = `${project.root}/.rootstorerc`;
  const content = JSON.stringify(config, null, 2);

  return createWriteFileRule(path, content);
}

export function getAngularProject(
  workspace: WorkspaceSchema,
  name?: string
): WorkspaceProject {

  const actualName: string = name as string;
  if(actualName && actualName !== 'defaultProject') {
    return workspace.projects[actualName];
  }

  if(actualName === 'defaultProject' && workspace.defaultProject) {
    return workspace.projects[workspace.defaultProject];
  }

  let projectCount = 0;
  let applicationCount = 0;
  let firstApplicationProject: WorkspaceProject | null = null;
  for(const key in workspace.projects) {
    if(workspace.projects.hasOwnProperty(key)) {
      projectCount++;

      const project = workspace.projects[key];
      if(project.projectType === 'application') {
        applicationCount++;
        if(!firstApplicationProject) {
          firstApplicationProject = project;
        }
      }
    }
  }

  if(projectCount === 1) {
    return workspace.projects[0];
  }

  if(applicationCount === 1) {
    return firstApplicationProject as WorkspaceProject;
  }

  throw new SchematicsException('The workspace has multiple projects and an appropriate project could not be determined automatically.  Please specify the project to use.');
}

export function getAngularWorkspaceSchema(tree: Tree): WorkspaceSchema {
  const workspace = tree.read('/angular.json');

  if (!workspace) {
    throw new SchematicsException('angular.json file not found!');
  }

  return JSON.parse(workspace.toString());
}

export function getNextImportDeclarationPosition(file: SourceFile): number {
  let pos: number = 0;
  file.forEachChild((child: Node) => {
    if (child.kind === SyntaxKind.ImportDeclaration) {
      pos = child.end;
    }
  });
  return pos + 1;
}

export function getNextNgModuleImportPosition(file: SourceFile): number {
  let pos: number = 0;

  file.forEachChild((node: Node) => {
    if (node.kind === SyntaxKind.ClassDeclaration) {
      node.forEachChild((classChild: Node) => {
        if (classChild.kind === SyntaxKind.Decorator) {
          classChild.forEachChild((moduleDeclaration: Node) => {
            moduleDeclaration.forEachChild((objectLiteral: Node) => {
              objectLiteral.forEachChild((property: Node) => {
                if (property.getFullText().includes('imports')) {
                  pos = property.end;
                }
              });
            });
          });
        }
      });
    }
  });

  return pos - 1;
}

export function openAsSourceFile(tree: Tree, path: string): SourceFile {
  const file = tree.read(path);
  if (!file) {
    throw new SchematicsException(`${path} not found`);
  }
  return createSourceFile(path, file.toString(), ScriptTarget.Latest, true);
}

export function tryGetRootStoreConfigFromProject(tree: Tree, projectRoot: string): IRootStoreConfig | undefined {
  const rootStoreConfigPath = `/${projectRoot}/.rootstorerc`;
  const configJson = tree.read(rootStoreConfigPath);
  if (configJson) {
    return JSON.parse(configJson.toString());
  }

  return undefined;
}
