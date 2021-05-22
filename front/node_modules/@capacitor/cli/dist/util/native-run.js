"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformTargets = exports.runNativeRun = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const colors_1 = tslib_1.__importDefault(require("../colors"));
const errors_1 = require("../errors");
const node_1 = require("./node");
const subprocess_1 = require("./subprocess");
async function runNativeRun(args, options = {}) {
    const p = node_1.resolveNode(__dirname, path_1.dirname('native-run/package'), 'bin/native-run');
    if (!p) {
        errors_1.fatal(`${colors_1.default.input('native-run')} not found.`);
    }
    return await subprocess_1.runCommand(p, args, options);
}
exports.runNativeRun = runNativeRun;
async function getPlatformTargets(platformName) {
    const output = await runNativeRun([platformName, '--list', '--json']);
    const parsedOutput = JSON.parse(output);
    return [
        ...parsedOutput.devices.map((t) => ({ ...t, virtual: false })),
        ...parsedOutput.virtualDevices.map((t) => ({ ...t, virtual: true })),
    ];
}
exports.getPlatformTargets = getPlatformTargets;
