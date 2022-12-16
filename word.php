<?php

include_once 'lib/home.php';
include 'lib/database.php';

$wid = $_GET['wid'];
$word = $db->getProcessedRecord($wid);

$json = [];
$json['heading'] = 'Word.';
$json['data'] = $word;

echo json_encode($json);

?>