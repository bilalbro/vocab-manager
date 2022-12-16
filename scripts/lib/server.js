/**
 * Server module.
 * 
 * Send HTTP requests to the server and handle the response effectively.
 */

function xhrOnStateChange(resolve, reject) {
   if (this.readyState === 4) {

      if (this.status === 200) {
         var data = this.responseText;
         var contentType = this.getResponseHeader('content-type');

         if (contentType === 'application/json') {
            data = JSON.parse(data);
         }

         resolve(data);
      }

      else {
         reject(this.responseText);
      }
   }
}

function request(method = 'GET', url, payload) {
   return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader('--XHR', 'True');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.onreadystatechange = xhrOnStateChange.bind(xhr, resolve, reject)
      xhr.send(payload);
   });
}

export default {
   request,
};