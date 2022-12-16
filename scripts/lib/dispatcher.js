/**
 * Dispatcher module.
 * 
 * This is a pub/sub system that delegates events sent to it to respective
 * handlers.
 */

var eventsMap = {};

function subscribe(eventName, handler) {
   eventsMap[eventName] = handler;
}

function dispatch(eventName, data) {
   eventsMap[eventName](data);
}

export default {
   dispatch,
   subscribe
};