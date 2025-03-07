
class EventDispatcher {
    #listeners = [];
    construct() {
    }

    registerListener(event, listener) {
        if(!this.#listeners[event]) {
            this.#listeners[event] = [];
        }
        
        this.#listeners[event].push(listener);
    }

    dispatchEvent(event, data) {
        if(this.#listeners[event]) {
            this.#listeners[event].array.forEach(listener => {
               listener(data) 
            });
        }
    }

    deprovisionListener(event, listener) {
        if(this.#listeners[event]) [
            this.#listeners[event] = this.#listeners[event].filter(lis => lis != listener);
        ]
    }
}
module.exports = EventDispatcher;