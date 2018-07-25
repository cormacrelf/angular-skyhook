module.exports = {
	bail: true,
	globals: {
		"ts-jest": {
			tsConfigFile: "./tsconfig.test.json",
			useExperimentalLanguageServer: true
		},
		__TRANSFORM_HTML__: true
	},
	setupTestFrameworkScriptFile: "./test/test-setup.ts",
	transform: {
		"^.+\\.(ts|js|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js"
	},
	moduleNameMapper: {
		"angular-skyhook": "<rootDir>/packages/angular-skyhook",
		"angular-skyhook-multi-backend": "<rootDir>/packages/angular-skyhook-multi-backend",
		"angular-skyhook-card-list": "<rootDir>/packages/angular-skyhook-card-list"
	},
	testRegex: ".*spec.ts$",
	moduleFileExtensions: [
		"ts",
		"js",
		"json"
	],
	transformIgnorePatterns: [
        "/node_modules/",
        "/dist/"
	],
	modulePathIgnorePatterns: [
        "/node_modules/",
        "/dist/"
	],
	projects: [
		"<rootDir>",
		// "<rootDir>/packages/*"
	],
	collectCoverageFrom: [
		"packages/*/*/src/**/*.ts",
		"packages/*/src/**/*.ts"
	],
	coveragePathIgnorePatterns: [
		".*(spec|const|config|mock|module|public-api|index|mock|model).ts"
	],
	coverageReporters: [
		"lcovonly",
		"html"
	]
};
