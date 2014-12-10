startapp({
    "timeout": 60000,
    "res": {
        "resources": {
            "framework": [{
                "url": ["../engine/js/framework/framework.min.js"],
                "async": true
            }],
            "core": [{
                "url": ["../engine/js/core/core.min.js"],
                "async": true
            }]
        },
        "dependencies": {
            "framework": [],
            "core": ["framework"]
        },
        "unknown": []
    },
    "translations":{},
    "path": {"base": "./"}
});
