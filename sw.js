self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).then(function(networkResponse) {
            return networkResponse
        })
    )
})
