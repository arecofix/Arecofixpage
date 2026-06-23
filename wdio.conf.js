exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    port: 4723,
    path: '/wd/hub',
    specs: [
        './test/specs/**/*.js'
    ],
    exclude: [
        // 'path/to/excluded/files'
    ],
    maxInstances: 1,
    capabilities: [{
        // capabilities for local Appium web tests on an Android Emulator
        platformName: 'Android',
        'appium:deviceName': 'Android Emulator',
        'appium:automationName': 'UiAutomator2',
        // 'appium:app': '/path/to/your/capacitor-app.apk', // TODO: Reemplazar con el path del APK generado por capacitor
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}
