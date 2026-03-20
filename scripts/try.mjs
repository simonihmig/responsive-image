#!/usr/bin/env node

import { resolve, dirname } from 'node:path';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

async function main() {
  const args = process.argv.slice(2);
  const configFlagIndex = args.indexOf('--config');
  let configPath = null;
  let filteredArgs = args;

  if (configFlagIndex !== -1) {
    configPath = args[configFlagIndex + 1];
    if (!configPath || configPath.startsWith('--')) {
      process.stderr.write(`--config requires a path argument\n`);
      process.exit(-1);
    }
    filteredArgs = args.filter(
      (_, i) => i !== configFlagIndex && i !== configFlagIndex + 1,
    );
  }

  const command = filteredArgs[0];
  switch (command) {
    case 'list':
      await listCommand(configPath);
      break;
    case 'apply':
      await applyCommand(filteredArgs, configPath);
      break;
    case undefined:
      process.stderr.write(`supported commands: list, apply\n`);
      process.exit(-1);
      break;
    default:
      process.stderr.write(`no such command ${command}\n`);
      process.exit(-1);
  }
}

function normalizeScenario(scenario) {
  // always include an empty env by default, so that it's convenient to pass
  // `${{ matrix.env }}` in github actions
  return { env: {}, ...scenario };
}

async function listCommand(configPath) {
  const config = await loadConfig(configPath);
  process.stdout.write(
    JSON.stringify({
      name: config.scenarios.map((s) => s.name),
      include: config.scenarios.map((s) => normalizeScenario(s)),
    }),
  );
}

async function applyCommand(args, configPath) {
  const scenarioName = args[1];
  if (!scenarioName) {
    process.stderr.write(`apply command needs to be passed a scenario name\n`);
    process.exit(-1);
  }
  const config = await loadConfig(configPath);
  const scenario = config.scenarios.find((s) => s.name === scenarioName);
  if (!scenario) {
    process.stderr.write(`No such scenario "${scenarioName}"\n`);
    process.exit(-1);
  }
  await applyScenario(scenario);
}

async function loadConfig(configPath) {
  const resolvedPath = configPath
    ? resolve(process.cwd(), configPath)
    : resolve(process.cwd(), '.try.mjs');
  const { default: config } = await import(pathToFileURL(resolvedPath));
  return config;
}

async function applyScenario(scenario) {
  const pkgJSONPath = resolve(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgJSONPath, 'utf8'));
  if (scenario.npm) {
    for (let key of [
      'devDependencies',
      'dependencies',
      'peerDependencies',
      'overrides',
    ]) {
      if (scenario.npm[key]) {
        if (!pkg[key]) {
          pkg[key] = {};
        }
        Object.assign(pkg[key], scenario.npm[key]);
      }
    }
  }

  if (scenario.files) {
    for (let [filename, content] of Object.entries(scenario.files)) {
      const fullName = resolve(process.cwd(), filename);
      mkdirSync(dirname(fullName), {
        recursive: true,
      });
      writeFileSync(fullName, content);
    }
  }

  writeFileSync(pkgJSONPath, JSON.stringify(pkg, null, 2));
  process.stdout.write(`Applied scenario ${scenario.name}\n`);
}

await main();
