<?php

include_once 'lib/home.php';
include 'lib/database.php';

$record = [];

$record['word_name'] = $_POST['word_name'];
$record['synonyms'] = $_POST['synonyms'];
$record['meaning'] = $_POST['meaning'];
$record['examples'] = $_POST['examples'];
$record['usage'] = $_POST['usage'];

$db->addRecord($record);

$json = [];
$json['word_name'] = $record['word_name'];

echo json_encode($json);

?>