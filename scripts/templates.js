import Templates from './lib/templates.js';

Templates.rootElement(document.querySelector('.main'));

Templates.add('index', function(data) {
   return `
<div class="center main_center">
   <h1 class="main_h1">Vocabulary.</h1>
   <div id="tags"></div>
   <form class="no-submit" method="GET">
      <input class="form_input search-input" autocomplete="off" type="text" placeholder="Search for a word..." name="word_name">
      <button class="cta" aria-label="Search"></button>
      <div class="clearfix"></div>
   </form>
   <div class="ac_suggestions">
   </div>
</div>`
});

Templates.add('add', function(word = '') {
   var heading = word ? 'Update word.' :  'Add word.';

   return `
<h1 class="heading">${heading}</h1>
<form action="" method="POST">
   <div class="form_group form_group--inline">
      <div class="form_label">Word</div>
      <input class="form_input" value="${word && word.word_name}" autocomplete="off" type="text" placeholder="E.g. 'amazing'" name="word_name">
   </div>
   <div class="form_group form_group--inline">
      <div class="form_label">Synonyms</div>
      <input class="form_input" value="${word && word.synonyms}" type="text" placeholder="E.g. 'great, lovely'" name="synonyms">
   </div>
   <div class="form_group">
      <div class="form_label">Meaning</div>
      <input style="width: 600px"  value="${word && word.meaning}" class="form_input" type="text" placeholder="E.g. 'great, lovely'" name="meaning">
   </div>
   <div class="form_group form_group--inline">
      <div class="form_label">Examples</div>
      <textarea name="examples" id="" rows="10" style="width: 600px;" placeholder="E.g. &quot;The cat looked amazing.&quot;">${word && word.examples}</textarea>
   </div>
   ${word ? '' : `<div class="form_group form_group--inline">
   <div class="form_label">Importance</div>
   <input type="range" name="usage" id="" min="0" max="3" value="0">
</div>`}
   <div class="form_group">
      <button class="cta">${word ? 'Update' : 'Add'} &rarr;</button>
   </div>
</form>`;
});

Templates.add('listHtml', function(wordList) {
   var html = '';

   wordList.forEach(function(word) {
      html += `
<li class="word-list_item"><a href="/word?wid=${word['wid']}">
   <h2>${word['word_name']}</h2>
   <p class="word-list_item_desc">${word['meaning']}</p>
</a></li>
`;
   });

   return html;
});

Templates.add('list', function(data) {
   var heading = data.heading;
   var wordList = data.data;

   if (heading === 'All words.') {
      heading += ` <span class="light">(${wordList.length})</span>`;
   }

   var html = `
<h1 class="heading">${heading}</h1>
`;

   if (wordList.length) {
      html += `
<ol class="word-list">
   ${Templates.get('listHtml', wordList)}
   <li class="clearfix"></li>
</ol>
`;
   }

   else {
      html += `
<p>Nothing here...</p>
`;
   }

   return html;
});

Templates.add('word', function(data) {
   var heading = data.heading;
   var word = data.data;

   if (heading === 'Word.') {
      heading = '';
   }
   else {
      heading = `<span class="light">${heading}</span> `;
   }
   heading += `"${word['word_name']}"`;

   return `
<h1 class="heading mb-3">${heading}</h1>

<p class="text-md light-md">${word['meaning']}</p>

<h2 class="mt-5">Examples</h2>
<ol class="ol--marked example-list">${Templates.get('examplesHtml', word['examples'])}</ol>

<h2 class="mt-5">Synonyms</h2>
<p>${word['synonyms']}</p>

<h2 class="mt-5">Details</h2>
<table class="mt-2 details-table">
   <tr><th>Date added</th><th>Last date updated</th><th>Usage</th><th>Actions</th></tr>
   
   <tr>
      <td>${word['date_added']}</td>
      <td>${word['date_updated']}</td>
      <td>${word['usage']}</td>
      <td>
         <form id="actions-form">
            <a class="cta cta--sub" href="update?wid=${word['wid']}">Update</a>
            <button class="cta cta--danger cta--sub" formaction="/delete" name="wid" value="${word['wid']}">Delete</a>
            <button class="cta cta--success cta--sub" formaction="/use-word" name="wid" value="${word['wid']}">Use</a></td>
         </form>
   </tr>
      
</table>
`;
});

Templates.add('examplesHtml', function(examples) {
   var html = '';

   examples.forEach(function(example) {
      html += `<li class="example-list_item">${example}</li>`;
   });

   return html;
});