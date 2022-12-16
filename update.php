<?php

include_once 'lib/home.php';
include 'lib/database.php';

$wid = $_GET['wid'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

   $record = [];

   $record['word_name'] = $_POST['word_name'];
   $record['synonyms'] = $_POST['synonyms'];
   $record['meaning'] = $_POST['meaning'];
   $record['examples'] = $_POST['examples'];

   $db->updateRecord($wid, $record);

   $json = [];
   $json['wid'] = $wid;
   $json['word_name'] = $record['word_name'];

   echo json_encode($json);
}

else {
   $word = $db->getRecord($wid);

   echo json_encode($word);
}

?>