<?php

include_once 'lib/home.php';
include 'lib/database.php';

$word = $db->getRandomRecord();
$wid = $word['wid'];

$json = [];
$json['heading'] = 'Random word -';
$json['data'] = $word;

echo json_encode($json);

?>