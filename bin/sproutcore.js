#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { program } from 'commander';

import { createApp } from '../generators/app.js';
import { createFramework } from '../generators/framework.js';
import { createProject } from '../generators/project.js';
import { create } from 'domain';

function generateProject (name) {
  const projectPath = path.join(process.cwd(), name);
  // do some basic checks
  if (fs.existsSync(projectPath)) {
    console.log(`Directory ${projectPath} already exists`);
    process.exit(1);
  }

  createProject(name, projectPath);

  console.log(`\n\nProject ${name} created at ${projectPath}`);
  console.log('To start the project, run the following commands:');
  console.log(`\n> cd ${name}`);
  console.log('> npm start');
  console.log('\nwait till webpack reports ready, and then open http://localhost:4020 in your browser.\n');
}

function generateApp (name) {
  console.log('not supported yet');
  process.exit(0);
}


function generateFramework (project) {
  console.log('not supported yet');
  process.exit(0);
}


program
  .argument('<template>', 'template name, accepted values are "project", "app", "framework"')
  .argument('<name>', 'name for project, app or framework. Use snake case.')
  .showHelpAfterError()
  .action( (template, name) => {
    if (!template || !name) {
      console.log('Please provide a template and a target name');
      process.exit(1);
    }

    template = template.toLowerCase();
    name = name.toLowerCase();

    if (template !== 'project' && template !== 'app' && template !== 'framework') {
      console.log('Invalid template name. Accepted values are "project", "app", "framework"');
      process.exit(1);
    }
    switch (template) {
      case 'project':
        generateProject(name);
        break;
      case 'app':
        generateApp(name);
        break;
      case 'framework':
        generateFramework(name);
        break;
    }
  })
  .parse(process.argv);