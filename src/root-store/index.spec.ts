import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('root-store', () => {
  it('works', async () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = await runner.runSchematicAsync('ng-schematics', {}, Tree.empty());
    tree.subscribe(t => expect(t.files).toEqual([]));
    
  });
});
