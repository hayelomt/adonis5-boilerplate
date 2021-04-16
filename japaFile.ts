import 'reflect-metadata';
import execa from 'execa';
import { join } from 'path';
import getPort from 'get-port';
import { configure } from 'japa';
import sourceMapSupport from 'source-map-support';

process.env.NODE_ENV = 'testing';
process.env.ADONIS_ACE_CWD = join(__dirname);
sourceMapSupport.install({ handleUncaughtExceptions: false });

async function runMigrations() {
  await execa.node('ace', ['migration:run', '--silent'], {
    stdio: 'inherit',
  });
}

async function clearConsole() {
  // await execa('clear', [], {
  //   stdio: 'inherit',
  // });
}

async function rollbackMigrations() {
  // await execa.node('ace', ['migration:rollback'], {
  //   stdio: 'inherit',
  // });
}

async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor');
  process.env.PORT = String(await getPort());
  await new Ignitor(__dirname).httpServer().start();
}

function getTestFiles() {
  let userDefined = process.argv.slice(2)[0];
  if (!userDefined) {
    return 'app/test/**/*.spec.ts';
  }

  return `${userDefined.replace(/\.ts$|\.js$/, '')}.ts`;
}

/**
 * Configure test runner
 */
configure({
  files: getTestFiles(),
  before: [runMigrations, startHttpServer, clearConsole],
  after: [rollbackMigrations],
});
