import { ngPackagr } from "ng-packagr";
import { NEVER } from "rxjs";
import { catchError } from "rxjs/operators";

export const isWatchMode = !!process.env.WATCH_MODE;

ngPackagr()
	.forProject("./ng-package.js")
	.withTsConfig("../../tsconfig.build.json")
	.withOptions({
		watch: isWatchMode
	})
	.buildAsObservable()
	.pipe(
		catchError(() => {
			if (!isWatchMode) {
				process.exitCode = 1;
			}
			return NEVER;
		})
	)
	.subscribe();

