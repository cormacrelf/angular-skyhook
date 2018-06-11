const { ngPackagr } = require('ng-packagr');
const { readConfiguration } = require('@angular/compiler-cli');
const path = require('path');

const projectDir = '.'; // << dir of my project in this case.

const project = path.join(
  __dirname,
  projectDir,
  'package.json'
);

const config = readConfiguration(
  path.join(
    __dirname,
    projectDir,
    'tsconfig.json'
  )
);

ngPackagr()
  .forProject(project)
  .withTsConfig(config)
  .build()
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
