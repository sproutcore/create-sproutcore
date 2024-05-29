import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { execSync } from 'child_process';
import { nameToNamespace, company } from './generator_basics.js';

const __dirname = new URL('.', import.meta.url).pathname;
const templatePath = path.join(__dirname, '..', 'templates', 'framework');

export const createFramework = (name, basePath) => {
    console.log('Creating folders for framework...', name);
    // we will create a framework in the given basePath

    const folders = ['resources', 'controllers', 'states', 'views', 'fixtures', 'models'];
    folders.forEach((folder) => {
        fs.mkdirSync(path.join(basePath, folder));
    });

    const paths = [
        'core.js',
    ];

    paths.forEach((filePath) => {
        console.log('Rendering framework file:', filePath);
        const templateFilename = path.basename(filePath);
        const templateFilePath = path.join(templatePath, templateFilename + '.ejs');
        const template = fs.readFileSync(templateFilePath).toString();
        const renderedTemplate = ejs.render(template, {
                name,
                namespace: nameToNamespace(name),
                company,
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
};