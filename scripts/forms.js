
import Form from './lib/form-router.js';
import Templates from './lib/templates.js';
import Notification from './lib/notification.js';
import Navigation from './lib/navigation.js';

Form.add('/use-word', function(payload) {
   Templates.render('word', payload);
   Notification.make(`Usage for word '${payload.data['word_name']}' successfully updated.`);
});

Form.add('/delete', function(payload) {
   Notification.make(`Word '${payload['word_name']}' successfully deleted.`);
   Navigation.replace('/list');
});

Form.add('/add', function(payload) {
   Notification.make(`Added word '${payload.word_name}' successfully.`);
   Navigation.add('/list');
});

Form.add(/^\/update/, function(payload) {
   Notification.make(`Updated word '${payload.word_name}' successfully.`);
   Navigation.add('/word?wid=' + payload.wid);
});

