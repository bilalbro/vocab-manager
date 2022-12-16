/**
 * Navigation module.
 * 
 * All the state-push logic goes here. This is the module that drives the router
 * and gets all routes to execute as expected.
 */

import './additions.js';
import Router from './router.js';
import './form-submit.js';
import Server from './server.js';


/**
 * Load a given page.
 * This includes checking the router for a matching route and then sending a
 * request to the backend server for data.
 */
async function loadPage() {
   var url = location.pathname + location.search;

   var routes = Router._probe(url);
   // At this stage, we have a list of routes with us.

   // Firstly, we'll call all the oninit handlers, if they've been set.
   routes.forEach(function(route) {
      if (route.oninit) {
         route.oninit();
      }
   })

   // Secondly, we'll send the underlying request to the server and once it completes,
   // call each route's onload handler. But this will only be done if the matched
   // route has the connection attribute set to true.
   // Simple :)

   var connectionMade = false;
   var payload = null;
   var locals = {};

   for (var i = 0; i < routes.length; i++) {
      var route = routes[i];

      // If the current route asks for making a connection, make it.
      if (route.connect) {
         // If a connection has been made already, no need to make it again!
         if (!connectionMade) {
            connectionMade = true;
            payload = await Server.request('GET', url);
         }
         route.onload(payload, locals);
      }

      else {
         route.onload(payload, locals);
      }
      
   }
}


function updateAddressBar(url) {
   // If the current URL and the given url are the same, there is no point of
   // adding a new entry.
   //  In fact, the browser's normal navigation mechanism works in the same way.

   if (location.href !== url) {
      history.pushState(null, '', url);
   }
   else {
      history.replaceState(null, '', url);
   }
   loadPage();
}



window.addEventListener('load', function(e) {
   loadPage();
});



// When a new URL is visited by means of history traversal or explicit navigation
// probe the router. 
window.addEventListener('popstate', function(e) {
   loadPage();
});



// Prevent default behaviour of all <a> elements. Those that don't want an xhr
// behaviour should be given a .no-xhr class.

window.addEventListener('click', function(e) {
   var anchorElement = e.target.isItselfOrWithin('a');

   if (anchorElement && !anchorElement.classList.contains('no-xhr')) {
      e.preventDefault();
      var href = anchorElement.href;

      // At this point, it has been confirmed that a <a> link has been clicked
      // and that it doesn't have the .no-xhr class set. Thus, we need to emulate
      // the normal browser navigation on this click.
      //
      // Step 1:
      // Change the browser's address bar using history.pushState().
      //
      // Step 2:
      // Make a request to the server for the given resource and once it has been
      // fetched, invoke the router to probe for route matches.


      // Step 1
      updateAddressBar(href);
   }
});


/**
 * Replace the current URL with the given url.
 * @param {string} url
 */
function replace(url) {
   history.replaceState(null, '', url);
   loadPage();
}


export default {
   replace,
   add: updateAddressBar
};