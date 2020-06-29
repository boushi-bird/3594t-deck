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

const conf = jsYaml.safeLoad(fs.readFileSync(srcConfigPath, 'utf8')) as any;

if (process.env.GH_PAGES_URL) {
  conf['url'] = process.env.GH_PAGES_URL;
}

if (process.env.GOOGLE_TAG_MANAGER_CONTAINER_ID) {
  conf['google_tag_manager'] = process.env.GOOGLE_TAG_MANAGER_CONTAINER_ID;
}

if (process.env.GOOGLE_SITE_VERIFICATION) {
  const siteVerificationFileName = `${process.env.GOOGLE_SITE_VERIFICATION}.html`;
  const distSiteVerification = path.resolve(distDir, siteVerificationFileName);
  fs.writeFileSync(distSiteVerification, `google-site-verification: ${siteVerificationFileName}`, 'utf8');
  console.log(`output ${distSiteVerification}`);

  const configDefaults: object[] = conf['defaults'] || [];
  configDefaults.push({ scope: { path: siteVerificationFileName }, values: { sitemap: false} });
}

fs.writeFileSync(distConfigPath, jsYaml.safeDump(conf), 'utf8');
console.log(`output ${distConfigPath}`);
