/**
 * Service Worker for Push Notifications
 */

// Listen for push events
self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  let notification;

  try {
    notification = event.data.json();
  } catch (error) {
    // If not JSON, use text
    notification = {
      title: "Rose App",
      body: event.data.text(),
    };
  }

  const title = notification.title || "Rose App";
  const options = {
    body: notification.body || notification.message || "",
    icon: notification.icon || "/assets/icons/favicon.svg",
    badge: notification.badge || "/assets/icons/favicon.svg",
    image: notification.image,
    data: notification.data || {},
    tag: notification.tag || "default",
    requireInteraction: notification.requireInteraction || false,
    actions: notification.actions || [],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Listen for notification click events
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Handle notification action buttons
  if (event.action) {
    // Custom action handling
    console.log("Notification action clicked:", event.action);
  } else {
    // Default click - open the app
    const urlToOpen = event.notification.data?.url || "/";

    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((windowClients) => {
          // Check if there is already a window open
          for (const client of windowClients) {
            if (client.url === urlToOpen && "focus" in client) {
              return client.focus();
            }
          }

          // If not, open a new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Listen for push subscription change
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe(event.oldSubscription.options)
      .then((subscription) => {
        // Send new subscription to backend
        return fetch("/api/push-notifications/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription.toJSON()),
        });
      })
  );
});
