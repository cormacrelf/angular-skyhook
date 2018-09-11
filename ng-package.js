module.exports = {
    deleteDestPath: !process.env.WATCH_MODE,
	lib: {
		entryFile: "public-api.ts",
		cssUrl: "inline",
		umdModuleIds: {
			// vendors
			"tslib": "tslib",
            "dnd-core": "dndCore",
            "react-dnd-html5-backend": "dndHtml5Backend",
            "react-dnd-touch-backend": "dndTouchBackend",
            "dnd-multi-backend": "dndMultiBackend",

			// local
            "@angular-skyhook/core": "angularSkyhook",
		}
	},
	whitelistedNonPeerDependencies: [
		".",
		"dnd-core",
		"dnd-multi-backend",
		"react-dnd-html5-backend",
		"react-dnd-touch-backend",
	]
}
