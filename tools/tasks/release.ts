import { Dictionary } from "lodash";
import * as lernaNpmPublish from "@lerna/npm-publish";
import { join, resolve } from "path";
import { execSync } from "child_process";
import { readJsonSync, writeJsonSync } from "fs-extra";

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

const log = require('npmlog');

// https://github.com/lerna/lerna/issues/91
type Pkg = PackageJson & { location: string, rootPath: string; tarball: any };
const originalNpmPack = (lernaNpmPublish as any).npmPack;
const npmPack = (
	rootManifest: any,
	packages: Pkg[]
) => {
	// modify the packages array in place
	// because pkg.location is readonly so we can't modify each pkg
	for (let i = 0; i < packages.length; i++) {
		let pkg = packages[i];
		updateDistPackageJson(pkg.location);
		const joined = join(pkg.location, "dist");
		log.info('INTERCEPTED', 'publishing in', joined, 'instead');
		packages[i] = {
			...pkg,
			location: joined,
			// and also there is some weirdness with ...pkg not including all properties
			rootPath: pkg.rootPath,
			version: pkg.version,
		};
	}
	return originalNpmPack(rootManifest, packages);
};


const modulePath = resolve("./node_modules/@lerna/npm-publish/npm-publish.js");
require("module")._cache[modulePath].exports.npmPack = npmPack;
// reimplement https://github.com/lerna/lerna/blob/master/utils/npm-publish/npm-publish.js
// using our own npmPack
require("module")._cache[modulePath].exports.makePacker =
	(rootManifest: any) => {
		// no opts will cause originalNpmPack to create opts = makePackOptions
		return (packages: Pkg[]) => npmPack(rootManifest, packages);
	};

process.argv.splice(0, 2, "publish");

const publishCmd = require("@lerna/publish/command");
require("@lerna/cli")()
	.command(publishCmd)
	.parse(process.argv);