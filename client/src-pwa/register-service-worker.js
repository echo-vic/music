/*
 * This file is picked up by the build system only
 * when building for PRODUCTION
 */

import { register } from 'register-service-worker'

register(process.env.SERVICE_WORKER_FILE, {
  ready () {
    console.log('App is being served from cache by a service worker.')
  },
  registered (registration) { // registration -> a ServiceWorkerRegistration instance
    console.log('Service worker has been registered.')
    registration.pushManager.subscribe({userVisibleOnly: true})
      .then(function (sub) {
        var endpointSections = sub.endpoint.split('/')
        var subscriptionId = endpointSections[endpointSections.length - 1]
        console.log('endpoint:', subscriptionId)
      })
  },
  cached (registration) { // registration -> a ServiceWorkerRegistration instance
    console.log('Content has been cached for offline use.')
  },
  updatefound (registration) { // registration -> a ServiceWorkerRegistration instance
    console.log('New content is downloading.')
  },
  updated (registration) { // registration -> a ServiceWorkerRegistration instance
    console.log('New content is available; please refresh.')
    window.location.reload(true)
  },
  offline () {
    console.log('No internet connection found. App is running in offline mode.')
  },
  error (err) {
    console.error('Error during service worker registration:', err)
  }
})

// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
