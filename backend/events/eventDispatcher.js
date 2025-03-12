
class EventDispatcher {
    #listeners = [];
    construct() {
    }

    async registerListener(event, listener) {
        if(!this.#listeners[event]) {
            this.#listeners[event] = [];
        }
        
        this.#listeners[event].push(listener);
    }

    async dispatchEvent(event, data) {
        if(this.#listeners[event]) {
            this.#listeners[event].array.forEach(listener => {
               listener(data) 
            });
        }
    }

    async deprovisionListener(event, listener) {
        if(this.#listeners[event]) {
            this.#listeners[event] = this.#listeners[event].filter(lis => lis != listener);
        }
    }
}
module.exports = EventDispatcher;