startapp({
    "timeout": 60000,
    "css_callback_timeout": 300,
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
    "translations": {},
    "locale": "en",
    "path": {
        "base": "./",
        "webui": "../webui",
        "webui_engine": "../engine"
    }
});
