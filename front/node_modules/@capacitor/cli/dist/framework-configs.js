"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFramework = void 0;
const FRAMEWORK_CONFIGS = [
    {
        name: 'Angular',
        isMatch: config => hasDependency(config, '@angular/cli') &&
            !hasDependency(config, '@ionic/angular'),
        webDir: 'dist',
    },
    {
        name: 'Create React App',
        isMatch: config => hasDependency(config, 'react-scripts') &&
            !hasDependency(config, '@ionic/react'),
        webDir: 'build',
    },
    {
        name: 'Ember',
        isMatch: config => hasDependency(config, 'ember-cli'),
        webDir: 'dist',
    },
    {
        name: 'Gatsby',
        isMatch: config => hasDependency(config, 'gatsby'),
        webDir: 'public',
    },
    {
        name: 'Ionic Angular',
        isMatch: config => hasDependency(config, '@ionic/angular'),
        webDir: 'www',
    },
    {
        name: 'Ionic React',
        isMatch: config => hasDependency(config, '@ionic/react'),
        webDir: 'build',
    },
    {
        name: 'Ionic Vue',
        isMatch: config => hasDependency(config, '@ionic/vue'),
        webDir: 'public',
    },
    {
        name: 'Next',
        isMatch: config => hasDependency(config, 'next'),
        webDir: 'public',
    },
    {
        name: 'Preact',
        isMatch: config => hasDependency(config, 'preact-cli'),
        webDir: 'build',
    },
    {
        name: 'Stencil',
        isMatch: config => hasDependency(config, '@stencil/core'),
        webDir: 'www',
    },
    {
        name: 'Svelte',
        isMatch: config => hasDependency(config, 'svelte') && hasDependency(config, 'sirv-cli'),
        webDir: 'public',
    },
    {
        name: 'Vue',
        isMatch: config => hasDependency(config, '@vue/cli-service') &&
            !hasDependency(config, '@ionic/vue'),
        webDir: 'dist',
    },
];
function detectFramework(config) {
    return FRAMEWORK_CONFIGS.find(f => f.isMatch(config));
}
exports.detectFramework = detectFramework;
function hasDependency(config, depName) {
    const deps = getDependencies(config);
    return deps.includes(depName);
}
function getDependencies(config) {
    var _a, _b, _c, _d;
    const deps = [];
    if ((_b = (_a = config === null || config === void 0 ? void 0 : config.app) === null || _a === void 0 ? void 0 : _a.package) === null || _b === void 0 ? void 0 : _b.dependencies) {
        deps.push(...Object.keys(config.app.package.dependencies));
    }
    if ((_d = (_c = config === null || config === void 0 ? void 0 : config.app) === null || _c === void 0 ? void 0 : _c.package) === null || _d === void 0 ? void 0 : _d.devDependencies) {
        deps.push(...Object.keys(config.app.package.devDependencies));
    }
    return deps;
}
