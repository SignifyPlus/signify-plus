class EventDispatcher {
   static listeners = [];
   static async registerListener(event, listener) {
      if (!EventDispatcher.listeners[event]) {
         EventDispatcher.listeners[event] = [];
      }
      EventDispatcher.listeners[event].push(listener);
   }

   static async dispatchEvent(event, data) {
      if (EventDispatcher.listeners[event]) {
         EventDispatcher.listeners[event].forEach((listener) => {
            listener(data);
         });
      }
   }

   static async deprovisionListener(event, listener) {
      if (EventDispatcher.listeners[event]) {
         EventDispatcher.listeners[event] = EventDispatcher.listeners[
            event
         ].filter((lis) => lis != listener);
      }
   }
}
module.exports = EventDispatcher;
