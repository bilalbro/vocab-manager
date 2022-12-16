/**
 * Form submission processing module.
 */

import Server from './server.js';
import FormRouter from './form-router.js';


/**
 * Handle form submission.
 * This function not only sends and handles an HTTP request on behalf of a <form>
 * but also calls all oninit functions defined for the form router.
 * @param {string} action 
 * @param {string} method 
 * @param {FormData} data 
 */
function sendAndHandle(action, method, data) {
   var matchingRoutes = FormRouter._probe(action);

   // Call all oninit handlers, if there are any.
   matchingRoutes.forEach(function(route) {
      route.oninit && route.oninit();
   });

   // Handle form submission.

   // If the method is GET, we can't send data as a payload in XMLHttpRequest's
   // send() method. Instead, we have to append it to the URL and reset data to
   // undefined.
   if (method === 'get') {
      action += '?' + (new URLSearchParams(data)).toString();
      data = undefined;
   }

   Server.request(method, action, data)

   .then(function(data) {
      matchingRoutes.forEach(function(route) {
         route.onload(data);
      })
   });
}


window.addEventListener('submit', function(e) {
   e.preventDefault();

   var submitter = e.submitter;
   var form = e.target;

   var action, method;

   // If the submitter button has a formaction attribute on it, use that.
   // Otherwise, go with the form's action attribute.
   action = submitter.getAttribute('formaction');
   if (!action) {
      action = form.getAttribute('action');
      action = action ? action : location.pathname + location.search;
   }
   
   var method = form.method.toLowerCase();

   var formData = new FormData(form);

   // If the submitter button has a name attribute, add that to the FormData
   // object as well. This is done as it is not done automatically.
   if (submitter.hasAttribute('name')) {
      formData.set(
         submitter.getAttribute('name'),
         submitter.getAttribute('value')
      );
   }
   
   // At this stage, the form's data has been put and nicely saved inside the
   // formData variable. Now, we need to send this to the server and handle its
   // response.
   // But this should only happen if the form is not a .no-submit form
   if (!form.classList.contains('no-submit')) {
      sendAndHandle(action, method, formData);
   }
});