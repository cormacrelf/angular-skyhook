import { Dictionary } from "lodash";
import * as lernaNpmPublish from "@lerna/npm-publish";
import { join, resolve } from "path";
import { execSync } from "child_process";
import { readJsonSync, writeJsonSync } from "fs-extra";
const log = require('npmlog');

interface PackageJson {
	name?: string;
	version?: string;
	peerDependencies?: Dictionary<string>;
	devDependencies?: Dictionary<string>;
	dependencies?: Dictionary<string>;
	[key: string]: any;
}

function updateDistPackageJson(directory: string): void {
	const srcPkgJsonPath = resolve(directory, "package.json");
	const distPkgJsonPath = resolve(directory, "dist/package.json");

	const srcPkgJson = readJsonSync(srcPkgJsonPath) as PackageJson;

	// update the dist package json
	const { version, dependencies, peerDependencies, devDependencies } = srcPkgJson;

	const distPkgJson: PackageJson = {
		...readJsonSync(distPkgJsonPath),
		version,
		dependencies,
		devDependencies,
		peerDependencies
	}

	writeJsonSync(distPkgJsonPath, distPkgJson, { spaces: 2 });
}

// fail ci build if there is nothing to be released
try {
	execSync("lerna updated");
} catch (error) {
	console.error("No libraries to release.");
	process.exit(1);
}

// Lerna's maintainers have refused to allow publishing from a subdirectory,
// so we are going to monkey-patch the helper library that does this
//
// https://github.com/lerna/lerna/issues/91

type Pkg = PackageJson & { location: string, rootPath: string; tarball: any };

const originalNpmPack = (lernaNpmPublish as any).npmPack;

const npmPack = (rootManifest: any, packages: Pkg[]) => {
	// modify the packages array in place
	// because pkg.location is readonly so we can't modify each pkg
	// and the packages array needs to be shared between the two calls into the npm-publish helper library:
	// - first, npmPack, which attaches pkg.tarball = $(npm pack --json pkg.location) to each
	// - second, npmPublish, which reads the same (===) array and expects to find pkg.tarball.filename,
	//	 and runs `npm publish ${pkg.tarball.filename}`
	// it is a little bad that the lib depends on array mutations happening between otherwise unrelated calls, but what can you do
	for (let i = 0; i < packages.length; i++) {
		let pkg = packages[i];
		updateDistPackageJson(pkg.location);
		const joined = join(pkg.location, "dist");
		// you could use log output to make a test suite for the monkey-patching
		log.info('intercepted @lerna/npm-publish ', 'publishing', pkg.name, 'from', joined, 'instead');
		packages[i] = {
			...pkg,
			location: joined,
			// and also there is some weirdness with ...pkg not including all properties
			// this solves it for whatever reason
			rootPath: pkg.rootPath,
			version: pkg.version,
		};
	}
	return originalNpmPack(rootManifest, packages /* opts -> gets default value */);
};

// somewhat reimplement https://github.com/lerna/lerna/blob/master/utils/npm-publish/npm-publish.js
const modulePath = resolve("./node_modules/@lerna/npm-publish/npm-publish.js");
// just monkey-patching npmPack is not enough or even useful -- that API is not used directly,
// it is only used through makePacker
require("module")._cache[modulePath].exports.npmPack = npmPack;
require("module")._cache[modulePath].exports.makePacker = (rootManifest: any) => {
	// original redundantly specifies opts here
	// passing no opts will cause originalNpmPack to create opts = makePackOptions(rootManifest)
	// which is what we want
	return (packages: Pkg[]) => npmPack(rootManifest, packages);
};

// strip '/path/to/node/binary'  and  './tools/tasks/release.js'
// replace with 'publish'
process.argv.splice(0, 2, "publish");

const publishCmd = require("@lerna/publish/command");
require("@lerna/cli")()
	.command(publishCmd)
	.parse(process.argv);