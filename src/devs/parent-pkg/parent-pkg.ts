import * as fs from 'fs';

export class ParentPkg {

  private readonly parentPkg;
  private projectPkg;

  constructor() {
    this.parentPkg = require('../node_modules/@yggdrasil/devs/parent-pkg/parent-pkg.json');
    this.projectPkg = require('./package.json');
  }

  public mergeParentPkg() {
    Object.assign(this.projectPkg.scripts, this.parentPkg.scripts);
    Object.assign(this.projectPkg.nyc, this.parentPkg.nyc);

    fs.writeFileSync('./result/package.json', JSON.stringify(this.projectPkg, null, 2));
  }
}
