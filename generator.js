const fs = require('fs');
const path = require('path');
const { camelCase: camel } = require('camel-case');

const generateModel = require('./utils/generateModel');
const generateRepo = require('./utils/generateRepo');
const generateService = require('./utils/generateService');
const generateCreateVal = require('./utils/generateCreateVal');
const generateEditVal = require('./utils/generateEditVal');
const generateController = require('./utils/generateController');
const generateRouter = require('./utils/generateRouter');
const generateFactory = require('./utils/generateFactory');
const generateApiTest = require('./utils/generateApiTest');
const generateDBSchema = require('./utils/generateDBSchema');

const {
  model: templateData,
  routes,
  modelName,
  folder,
  rootFolder,
  apiUrl,
  roles,
} = require(`./${process.argv[2]}`);
const modulePath = path.join(__dirname, rootFolder);

const testModulePath = path.join(__dirname, `app/test/modules/${folder}`);

const createTestFiles = () => {
  console.log(`==> Writing test ${modelName} to ${testModulePath}`);
  if (!fs.existsSync(testModulePath)) {
    fs.mkdirSync(testModulePath, { recursive: true });
  }

  const factoryPath = path.join(
    testModulePath,
    `${camel(modelName)}Factory.ts`
  );
  fs.writeFileSync(
    factoryPath,
    generateFactory({ rootFolder, modelName, templateData })
  );

  const apiTestPath = path.join(
    testModulePath,
    `${camel(modelName)}Api.spec.ts`
  );
  fs.writeFileSync(
    apiTestPath,
    generateApiTest({
      folder,
      modelName,
      apiUrl,
      templateData,
      roles,
    })
  );

  generateDBSchema({ templateData });
};

const createModuleFiles = () => {
  console.log(`==> Writing module ${modelName} to ${rootFolder}`);
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
  }
  const modelPath = path.join(modulePath, `${camel(modelName)}.ts`);
  fs.writeFileSync(modelPath, generateModel({ templateData, modelName }));

  const repoPath = path.join(modulePath, `${camel(modelName)}Repo.ts`);
  fs.writeFileSync(repoPath, generateRepo({ modelName }));

  const servicePath = path.join(modulePath, `${camel(modelName)}Service.ts`);
  fs.writeFileSync(servicePath, generateService({ modelName }));

  const cValPath = path.join(modulePath, `c${modelName}Val.ts`);
  fs.writeFileSync(cValPath, generateCreateVal({ templateData, modelName }));

  const eValPath = path.join(modulePath, `e${modelName}Val.ts`);
  fs.writeFileSync(eValPath, generateEditVal({ templateData, modelName }));

  const controllerPath = path.join(
    modulePath,
    `${camel(modelName)}Controller.ts`
  );
  fs.writeFileSync(
    controllerPath,
    generateController({ modulePath, modelName })
  );

  const routerPath = path.join(modulePath, `${camel(modelName)}Routes.ts`);
  fs.writeFileSync(
    routerPath,
    generateRouter({
      folder,
      modelName,
      routes: routes.map,
      prefix: routes.prefix,
    })
  );
};

(async () => {
  createModuleFiles();
  createTestFiles();
  const exec = require('child_process').exec('npm run format');
  exec.stdout.pipe(process.stdout);
})();
