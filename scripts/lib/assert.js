/**
 * Assertion module.
 */

function checkType(value, ...types) {
   // Wrap the given value into an object using the Object() constructor.
   var wrappedValue = Object(value);

   for (var i = 0; i < types.length; i++) {
      if (wrappedValue instanceof types[i]) {
         return true;
      }
   }

   return false;
}

export default {
   checkType
};