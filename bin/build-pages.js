#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const cpx = require('cpx');

const srcDir = path.resolve(__dirname, '../docs');
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const srcConfigPath = path.resolve(srcDir, '_config.yml');
const distConfigPath = path.resolve(distDir, '_config.yml');

const conf = jsYaml.safeLoad(fs.readFileSync(srcConfigPath, 'utf8'));

if (process.env.GOOGLE_TAG_MANAGER_CONTAINER_ID) {
  conf['google_tag_manager'] = process.env.GOOGLE_TAG_MANAGER_CONTAINER_ID;
}

fs.writeFileSync(distConfigPath, jsYaml.safeDump(conf), 'utf8');

console.log(`output ${distConfigPath}`);
cpx.copy(path.resolve(srcDir, '**/*.{md,html}'), distDir, err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('output pages.');
});
