import "jest-preset-angular";
import "jest-localstorage-mock";

Object.defineProperty(window, "getComputedStyle", {
	value: () => ["-webkit-appearance"]
});
