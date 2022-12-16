<?php

include_once 'lib/home.php';
include 'lib/database.php';

$wordList = $db->getAllRecords();

$json = [];
$json['heading'] = 'All words.';
$json['data'] = $wordList;

echo json_encode($json);

?>