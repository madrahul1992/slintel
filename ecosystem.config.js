module.exports = {
    apps : [{
        name: "slintel-project",
        script: "/usr/src/app/dist/server.js",
        cwd: "/usr/src/app/",
        instances: 1,
        watch: false,
        env: {
            NODE_ENV: "development"
        }
    }]
};