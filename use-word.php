<?php

include_once 'lib/home.php';
include 'lib/database.php';

$wid = $_GET['wid'];
$db->useWord($wid);
$word = $db->getProcessedRecord($wid);

$json = [];
$json['heading'] = 'Word.';
$json['data'] = $word;

echo json_encode($json);

?>