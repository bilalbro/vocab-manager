/**
 * Router module.
 * 
 * 
 */


import assert from './assert.js';


class Route {
   static normalize(pattern) {
      if (typeof pattern === 'string')
         return new RegExp('^' + pattern + '$');

      return pattern;
   }

   routeInArray(url) {
      var routeCondList = this.routeCond;

      for (var i = 0; i < routeCondList.length; i++) {
         if (routeCondList[i].test(url)) {
            return true;
         }
      }

      return false;
   }

   /**
    * Given a url, determine if the underlying route matches the url.
    * @param {string} url 
    * @return {Route | Route[]}
    */
   matches(url) {
      // We have three cases to deal with.
      var routeCond = this.routeCond;

      // Case 1:
      // The routeCond property is a pattern. In that case, we simply do a one-
      // line check.
      if (routeCond instanceof RegExp) {
         if (routeCond.test(url)) {
            return this;
         }
         return false;
      }

      // Case 2:
      // The routeCond property is an array. In that case, we simply iterate over
      // all entries in the array and do the check.
      if (routeCond instanceof Array) {
         if (this.routeInArray(url)) {
            return this;
         }
         return false;
      }

      // Case 3:
      // The routeCond property is a sub-router. In that case, we call its
      // internal _probe() method.
      if (routeCond instanceof Router) {
         var matchingRoutes = routeCond._probe(url);
         if (matchingRoutes.length) {
            matchingRoutes.push(this);
         }
         return matchingRoutes;
      }
   }

   constructor(routeCond, oninit, onload, connect) {

      // If routeCond is a string, store it as a regular expression.
      if (typeof routeCond === 'string') {
         routeCond = Route.normalize(routeCond);
      }

      // If routeCond is an array, store it as an array of patterns.
      else if (routeCond instanceof Array) {
         for (var i = 0; i < routeCond.length; i++) {
            routeCond[i] = Route.normalize(routeCond[i]);
         }
      }

      // Otherwise, it's known that routeCond is another instance of Router.
      // Hence, we should store it as it is, without doing any processing.

      this.routeCond = routeCond;
      this.oninit = oninit;
      this.onload = onload;
      this.connect = connect;
   }
}


class Router {

   constructor() {
      this.routes = [];
   }

   /**
    * Probe in all routes to see a matching route for the given url, and then return
    * a list of all the matching Route objects.
    * @param {string} url
    * @returns {Route[]}
    */
   _probe(url) {
      var matchingRoutes = [];

      this.routes.forEach(function(route) {
         // When matching a route with a given url, there are two cases to
         // consider.
         var returnedRoutes = route.matches(url);

         // Case 1:
         // The route's routeCond property is a pattern or an array. In that,
         // case, route.matches() returns the underlying Route instance. We push
         // this Route instance to our list of matchingRoutes.
         if (returnedRoutes instanceof Route) {
            matchingRoutes.push(returnedRoutes);
         }

         // Case 2:
         // The route's routeCond property is a Router instance. In that case,
         // route.matches() returns an array (following from the return value of
         // the Router instance's _probe() method).
         // So we need to go over each entry in the array and add it manually
         // to our list of routes.
         else if (returnedRoutes instanceof Array) {
            returnedRoutes.forEach(function(returnedRoute) {
               matchingRoutes.push(returnedRoute);
            });
         }

         // Apart from these two cases, we don't need to worry about falsey cases
         // because they are just falsey :)
      });

      return matchingRoutes;
   }

   /**
    * Add a route to the internal system of routes.
    * @param {string | RegExp | Router} routeCond 
    * @param {function} beforeload 
    * @param {function} onload
    * @returns {void}
    */
   add(routeCond, oninit, onload) {
      if (!assert.checkType(routeCond, String, RegExp, Array, Router)) {
         throw new Error('Invalid type for parameter `routeCond`.');
      }

      // If we are provided with two parameters, oninit becomes onload.
      if (onload === undefined) {
         onload = oninit;
         oninit = null;
      }

      var connect = true;
      var route = new Route(routeCond, oninit, onload, connect);

      this.routes.push(route);
   }

   /**
    * Add a static route to the internal system of routes. Static routes are those
    * that don't get any connection made with the server.
    * @param {string | RegExp} routeCond
    * @param {function} beforeload 
    * @param {function} onload 
    * @returns {void}
    */
   staticAdd(routeCond, oninit, onload) {
      if (!assert.checkType(routeCond, String, RegExp, Router)) {
         throw new Error('Invalid type for parameter `routeCond`.');
      }

      if (onload === undefined) {
         onload = oninit;
         oninit = null;
      }

      var connect = false;
      var route = new Route(routeCond, oninit, onload, connect);

      this.routes.push(route);
   }
}


// This is a wrapper function to create a new sub-router instance.
function sub() {
   return new Router();
}


var globalRouter = new Router();


export default {
   add: globalRouter.add.bind(globalRouter),
   staticAdd: globalRouter.staticAdd.bind(globalRouter),
   _probe: globalRouter._probe.bind(globalRouter),
   sub
};