/**
 * Form routing module.
 */

import Router from './router.js';

var formRouter = Router.sub();

export default {
   add: formRouter.add.bind(formRouter),
   _probe: formRouter._probe.bind(formRouter)
}