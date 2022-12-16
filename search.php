<?php

include_once 'lib/home.php';
include 'lib/database.php';


// Used in the navigation link highlighting

$word_name_query = $_GET['word_name'];

// sleep(2);

// Process $word_name_query.
// Check if it's meant to include a wildcard on both of its sides or just its
// end.

$left_wildcard = '';
$right_wildcard = '';

$search_synonyms = true;

if (str_starts_with($word_name_query, '-')) {
   $word_name_query = substr($word_name_query, 1);
   $left_wildcard = '%';
   $search_synonyms = false;
}

if (str_ends_with($word_name_query, '-')) {
   $word_name_query = substr($word_name_query, 0, -1);
   $right_wildcard = '%';
   $search_synonyms = false;
}

if ($search_synonyms) {
   $left_wildcard = '%';
   $right_wildcard = '%';
}

$wordList = $db->searchRecord($word_name_query,
                              $left_wildcard,
                              $right_wildcard,
                              $search_synonyms);

$json = [];
$json['data'] = $wordList;

echo json_encode($json);

?>