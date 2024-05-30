import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { execSync } from 'child_process';
import { nameToNamespace, company, dasherize } from './generator_basics.js';

const __dirname = new URL('.', import.meta.url).pathname;
const templatePath = path.join(__dirname, '..', 'templates', 'app');


export const createApp = (name, basePath) => {
    // this renders the ejs files into the appFolder, which is in the basePath
    // after rendering the files, it runs the updateIndexjs function
    // from sproutcore to create an index.js file in the basePath

    const folders = ['resources', 'controllers', 'states', 'views', 'fixtures', 'models'];
    folders.forEach((folder) => {
        fs.mkdirSync(path.join(basePath, folder));
    });

    const paths = [
        'core.js',
        'main.js',
        'controllers/controllers.js',
        'resources/loading.html',
        'resources/main_page.js',
        'resources/main_page.css',
        'resources/_theme.scss',
        'models/item.js',
        'fixtures/item.js',
        'states/statechart.js',
        'states/ready_state.js',
        'theme.js',
    ];

    paths.forEach((filePath) => {
        console.log('Rendering app file:', filePath);
        const templateFilename = path.basename(filePath);
        const templateFilePath = path.join(templatePath, templateFilename + '.ejs');
        const template = fs.readFileSync(templateFilePath).toString();
        const renderedTemplate = ejs.render(template, {
                name,
                namespace: nameToNamespace(name),
                company,
                extra: '',
                css_name: dasherize(name),
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

    // run the updateIndexjs cli command from sproutcore
    console.log('Generating index.js file...');
    const scPath = path.resolve(basePath, '..', '..', 'node_modules', 'sproutcore');
    execSync(`npx --yes --package=${scPath} -c 'create_indexjs ${basePath}'`, { stdio: 'inherit' });
}