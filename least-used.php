<?php

include_once 'lib/home.php';
include 'lib/database.php';

$wordList = $db->getLeastUsedRecords();

$json = [];
$json['heading'] = 'Least-used words.';
$json['data'] = $wordList;

echo json_encode($json);

?>