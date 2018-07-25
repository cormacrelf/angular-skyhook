import { Dictionary } from "lodash";
import * as LernaNpmUtils from "lerna/lib/NpmUtilities";
import { join, resolve } from "path";
import { execSync } from "child_process";
import { readJson, writeJson } from "fs-extra";

interface PackageJson {
	name?: string;
	version?: string;
	peerDependencies?: Dictionary<string>;
	dependencies?: Dictionary<string>;
	[key: string]: any;
}

async function updateDistPackageJson(directory: string): Promise<void> {
	const srcPkgJsonPath = resolve(directory, "package.json");
	const distPkgJsonPath = resolve(directory, "dist/package.json");

	const [srcPkgJson, distPkgJson] = await Promise.all<PackageJson>([
		readJson(srcPkgJsonPath),
		readJson(distPkgJsonPath)
	]);

	// update the dist package json
	distPkgJson.version = srcPkgJson.version;
	distPkgJson.dependencies = srcPkgJson.dependencies;
	distPkgJson.peerDependencies = srcPkgJson.peerDependencies;

	await writeJson(distPkgJsonPath, distPkgJson, { spaces: 2 });
}

// fail ci build if there is nothing to be released
try {
	execSync("lerna updated");
} catch (error) {
	console.error("No libraries to release.");
	process.exit(1);
}

// https://github.com/lerna/lerna/issues/91
const originalPublishTaggedInDir = LernaNpmUtils.publishTaggedInDir;
LernaNpmUtils.publishTaggedInDir = async (
	tag: string,
	pkg: any,
	registry: string,
	callback: (error: string | Error | null, stout: string) => void
) => {
	await updateDistPackageJson(pkg.location);
	const amendedPkg = {
		...pkg,
		location: join(pkg.location, "dist")
	};
	originalPublishTaggedInDir(tag, amendedPkg, registry, callback);
};

const modulePath = resolve("./node_modules/lerna/lib/NpmUtilities.js");

require("module")._cache[modulePath].exports = LernaNpmUtils;
process.argv.splice(2, 0, "publish");

// tslint:disable-next-line:import-vendors-first
import "lerna/bin/lerna";
