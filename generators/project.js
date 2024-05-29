import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { execSync } from 'child_process';
import { createApp } from './app.js';
import { createFramework } from './framework.js';
import { nameToNamespace, company } from './generator_basics.js';

const __dirname = new URL('.', import.meta.url).pathname;
const templatePath = path.join(__dirname, '..', 'templates', 'project');

export const createProject = (name, basePath) => {
    // this renders a SproutCore project in the given basePath
    // this means:
    // - create a folder with the given name
    // - create an apps folder in the project folder
    // - create a frameworks folder in the project folder
    // - create a package.json in the project folder
    // - run npm install in the project folder
    // - create a base app in the apps folder
    // - create a base framework in the frameworks folder
    // - create the webpack config files in the project folder

    const framework = `${name}_core`;

    console.log('Creating folders...');
    fs.mkdirSync(name);
    fs.mkdirSync(path.join(name, 'apps'));
    fs.mkdirSync(path.join(name, 'apps', name));
    fs.mkdirSync(path.join(name, 'frameworks'));
    fs.mkdirSync(path.join(name, 'frameworks', framework));

    const paths = [
        'package.json',
        'webpack.common.js',
        'webpack.dev.js',
        'webpack.prod.js',
        'webpack.config.js',
    ];

    fs.writeFileSync(path.join(name, '.gitignore'), 'node_modules');
    paths.forEach((filePath) => {
        console.log('Rendering project file:', filePath);
        const templateFilename = path.basename(filePath);
        const templateFilePath = path.join(templatePath, templateFilename + '.ejs');
        const template = fs.readFileSync(templateFilePath).toString();
        const renderedTemplate = ejs.render(template, {
                name,
                namespace: nameToNamespace(name),
                company,
                framework,
                appname: name,
                extra: '',
            },
            {
                root: path.resolve(__dirname, '..'),
                views: [
                    path.join(__dirname, '..', 'templates'),
                    path.join(__dirname, '..', 'templates', 'app'),
                    path.join(__dirname, '..', 'templates', 'framework'),
                    path.join(__dirname, '..', 'templates', 'project'),
                ]
            }
        );
        fs.writeFileSync(path.join(basePath, filePath), renderedTemplate);
    });

    console.log('Running npm install...');
    // run npm install in the project folder
    // execSync('npm install', { cwd: name, stdio: 'inherit'});
    // now we should have sproutcore, so we can create the base app

    console.log('Rendering rest of the project files...');

    // now create the base app
    createApp(name, path.join(name, 'apps', name));
    // create a support framework
    createFramework(framework, path.join(name, 'frameworks', framework));
}