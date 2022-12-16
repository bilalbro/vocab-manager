/**
 * Notification-making module.
 */

var notificationElement;
var displayTime = 3500;

function displayNotification(message) {
   notificationElement = document.createElement('div');
   notificationElement.className = 'notification';
   notificationElement.innerHTML = message;
   document.body.appendChild(notificationElement);
}

function hideNotifiation() {
   notificationElement.parentNode.removeChild(notificationElement);
}

function make(message) {
   displayNotification(message);

   setTimeout(function() {
      hideNotifiation();
   }, displayTime);
}

export default {
   make
};