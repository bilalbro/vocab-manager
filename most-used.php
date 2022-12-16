<?php

include_once 'lib/home.php';
include 'lib/database.php';

$wordList = $db->getMostUsedRecords();

$json = [];
$json['heading'] = 'Most-used words.';
$json['data'] = $wordList;

echo json_encode($json);

?>