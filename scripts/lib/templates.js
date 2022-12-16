/**
 * Template management module.
 * 
 * 
 */

import assert from './assert.js';

var templates = {};
var globalRootElement = null;

class Template {

   constructor(callback, rootElement) {
      this.callback = callback;
      this.rootElement = rootElement;
   }
}

function rootElement(element) {
   globalRootElement = element;
}

/**
 * Add a new template.
 * @param {string} name 
 * @param {Function} callback 
 * @param {Element} rootElement 
 */
function add(name, callback, rootElement) {
   if (!assert.checkType(name, String)) {
      throw new Error('Invalid value for parameter `name`.');
   }

   if (!assert.checkType(callback, Function)) {
      throw new Error('Invalid value for parameter `callback`. It can only be \
      a function');
   }

   templates[name] = new Template(callback, rootElement);
}


function render(name, data) {
   var template = templates[name];
   var html = get(name, data);

   // If the template has its own rootElement, dump all the HTML inside that
   // element.
   if (template.rootElement) {
      template.rootElement.innerHTML = html;
   }

   // Otherwise, if the global rootElement is set, use that.
   else if (globalRootElement) {
      globalRootElement.innerHTML = html;
   }
}


function get(name, data) {
   return templates[name].callback(data);
}

export default {
   add,
   get,
   render,
   rootElement
};