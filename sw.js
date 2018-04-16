const version = "1.01",
    preCache = "PRECACHE-" + version,
    dynamicCache = "DYNAMIC-" + version,
    preCacheFiles = [
        "/",
        "pong.css",
        "game.js",
        "pong.js",
        "images/press1.png",
        "images/press2.png",
        "images/winner.png",
        "sounds/goal.wav",
        "sounds/ping.wav",
        "sounds/pong.wav",
        "sounds/wall.wav"
    ];


self.addEventListener("install", event => {

    self.skipWaiting();

    console.log("installing precache files");

    caches.open(preCache).then(function (cache) {

        return cache.addAll(preCacheFiles);

    });

});


self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(cacheNames => {
            cacheNames.forEach(value => {

                if (value.indexOf(version) < 0) {
                    caches.delete(value);
                }

            });

            console.log("service worker activated");

            return;

        })

    );

});


self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request).then(response => {

            if (!response) {

                //fall back to the network fetch
                return fetch(event.request)
                    .then(response => {

                        if (response) {

                            if (event.request.url.indexOf("manifest.json") === -1) {

                                let copy = response.clone();

                                caches.open(dynamicCache)
                                    .then(cache => {

                                        cache.put(event.request, copy);

                                    });

                            }

                            return response;
                        }

                    });

            }

            return response;

        })

    )

});