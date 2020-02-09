#!/usr/bin/env ts-node

import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import jsYaml from 'js-yaml';

const srcDir = path.resolve(__dirname, '../docs');
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

fse.copySync(srcDir, distDir);
console.log('output pages.');

const srcConfigPath = path.resolve(srcDir, '_config.yml');
const distConfigPath = path.resolve(distDir, '_config.yml');

const conf = jsYaml.safeLoad(fs.readFileSync(srcConfigPath, 'utf8'));

if (process.env.GH_PAGES_URL) {
  conf['url'] = process.env.GH_PAGES_URL;
}

if (process.env.GOOGLE_TAG_MANAGER_CONTAINER_ID) {
  conf['google_tag_manager'] = process.env.GOOGLE_TAG_MANAGER_CONTAINER_ID;
}

fs.writeFileSync(distConfigPath, jsYaml.safeDump(conf), 'utf8');
console.log(`output ${distConfigPath}`);