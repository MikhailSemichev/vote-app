const { EventEmitter } = require('events');

class EventHub extends EventEmitter {
}

module.exports = new EventHub();
