import './lib/navigation.js';
import Router from './lib/router.js';
import Templates from './lib/templates.js';
import Server from './lib/server.js';
import Navigation from './lib/navigation.js';

import './templates.js';
import './forms.js';

import Autocompleter from './lib/autocomplete/index.js';

var navbarComponent = {
   navbarElement: document.querySelectorAll('nav ul li'),
   mapping: {
      '/': -1,
      '/word': -1,
      '/add': 0,
      '/list': 1,
      '/most-used': 2,
      '/least-used': 3,
      '/random': 4,
   },
   prev: null,
   change: function(className) {
      var index = this.mapping[className];

      if (index === -1) {
         this.prev && this.prev.classList.remove('nav_item--sel');
         return;
      }

      this.prev && this.prev.classList.remove('nav_item--sel');
      
      this.navbarElement[index].classList.add('nav_item--sel');

      this.prev = this.navbarElement[index];
   }
};


var subRouter = Router.sub();

subRouter.staticAdd('/', function(payload, locals) {
   Templates.render('index');

   var tags = document.querySelector('#tags');
   tags.onclick = function(e) {
      var span;
      if (span = e.target.isItselfOrWithin('span')) {
         var id = span.parentNode.getAttribute('data-index');
         ac.unselect(id);
         span.parentNode.parentNode.removeChild(span.parentNode);
      }
   }

   

   var ac = new Autocompleter({
      inputElement: document.getElementsByClassName('form_input')[0],
      suggestionsBoxElement: document.querySelector('.ac_suggestions'),

      matchTarget: function(storeEntry) {
         return storeEntry.word_name;
      },

      makeSelection: function(query, doneLoading) {
         Server.request('get', '/search?word_name=' + query)
         .then(function(data) {
            doneLoading(data.data);
         });
      },
      
      suggestionHTML: function(storeEntry) {
         return storeEntry.word_name;
      },

      inputValue: function(storeEntry) {
         return storeEntry.word_name;
      },

      onSelect: function(storeEntry) {
         Navigation.add('/word?wid=' + storeEntry.wid);
      },
      
      debounceDelay: 300,
      loadingHTML: function() {
         return `<div style="text-align: center"><div class="loading"></div></div>`;
      }
   });

});

subRouter.staticAdd('/add', function(payload, locals) {
   Templates.render('add');
});

subRouter.add([
   /^\/word/,
   '/random'
], function(payload, locals) {
   Templates.render('word', payload);
});

subRouter.add([
   '/list',
   '/most-used',
   '/least-used'
], function(payload, locals) {
   Templates.render('list', payload);
});

Router.add(/^\/update/, function(payload) {
   Templates.render('add', payload);
});

Router.staticAdd(subRouter, function(payload, locals) {
   navbarComponent.change(location.pathname);
});

Router.staticAdd(/^\//, function(payload) {
   setTimeout(function() {
      document.querySelector('.main').scrollTo({
         top: 0,
         behavior: 'smooth'
      });
   }, 100);
})
