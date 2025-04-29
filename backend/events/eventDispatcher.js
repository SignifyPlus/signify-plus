class EventDispatcher {
   static listeners = [];
   static async registerListener(event, listener) {
      if (!EventDispatcher.listeners[event]) {
         EventDispatcher.listeners[event] = [];
      }
      EventDispatcher.listeners[event].push(listener);
   }

   //made it async + promise.all ensures they run concurrently.
   //added the functionality to return the result
   static async dispatchEvent(event, data) {
      var dispatchResults = [];
      if (EventDispatcher.listeners[event]) {
         dispatchResults = await Promise.all(
            EventDispatcher.listeners[event].map((listener) => listener(data)),
         );
      }
      return dispatchResults;
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
