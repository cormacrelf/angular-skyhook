module.exports = {
	bail: true,
	globals: {
		"ts-jest": {
			tsConfigFile: "./tsconfig.test.json",
			useExperimentalLanguageServer: true
		},
		__TRANSFORM_HTML__: true
	},
    // https://github.com/facebook/jest/issues/6766
    testURL: 'http://localhost',
	setupTestFrameworkScriptFile: "./test/test-setup.ts",
	transform: {
		"^.+\\.(ts|js|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js"
	},
	moduleNameMapper: {
        "@angular-skyhook/(.*)": "<rootDir>/packages/$1"
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
		"packages/core/*/src/**/*.ts",
		"packages/multi-backend/*/src/**/*.ts",
		"packages/sortable/*/src/**/*.ts",
	],
	coveragePathIgnorePatterns: [
		".*(spec|const|config|mock|module|public-api|index|mock|model|d).ts"
	],
	coverageReporters: [
		"lcovonly",
		"html"
	]
};
