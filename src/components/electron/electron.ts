"use strict";

var global = <any>window;
let ipc:GitHubElectron.InProcess = global.require('ipc')
let remote:GitHubElectron.Remote = global.require('remote')
let webFrame:GitHubElectron.WebFrame = global.require('web-frame')

let clipboard: GitHubElectron.Clipboard = global.require('clipboard')
let crashReporter: GitHubElectron.CrashReporter = global.require('crash-reporter')
let nativeImage: typeof GitHubElectron.NativeImage = global.require('native-image')
let electronScreen: GitHubElectron.Screen = global.require('screen')
let shell: GitHubElectron.Shell = global.require('shell')

export {
    ipc,
    remote,
    webFrame,
    clipboard,
    crashReporter,
    nativeImage,
    electronScreen,
    shell
}
