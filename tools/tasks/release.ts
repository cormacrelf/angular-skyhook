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

// https://github.com/lerna/lerna/issues/91
const originalNpmPublish = (lernaNpmPublish as any).npmPublish;
(lernaNpmPublish as any).publishTaggedInDir = (
	pkg: any,
	tag: string,
	{ npmClient, registry }: { npmClient: string, registry: string }
) => {
	updateDistPackageJson(pkg.location);
	const amendedPkg = {
		...pkg,
		location: join(pkg.location, "dist")
	};
	originalNpmPublish(amendedPkg, tag, { npmClient, registry });
};

const modulePath = resolve("./node_modules/@lerna/npm-publish/npm-publish.js");

require("module")._cache[modulePath].exports = lernaNpmPublish;
process.argv.splice(0, 2, "publish");
require("@lerna/cli")().parse(process.argv);