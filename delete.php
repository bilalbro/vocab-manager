<?php

include_once 'lib/home.php';
include 'lib/database.php';

$wid = $_GET['wid'];
$word_name = $db->getRecord($wid)['word_name'];
$word = $db->deleteRecord($wid);

$json = [];
$json['word_name'] = $word_name;

echo json_encode($json);

?>