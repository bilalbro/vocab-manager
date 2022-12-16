<?php

// This is a simple script that checks if a --XHR header is present in the 
// request. If there is such a header, we send a JSON response. Otherwise, we
// internally redirect to /home.php.

// Simple :)

$headers = apache_request_headers();

if (!array_key_exists('--XHR', $headers)) {
   include dirname(__DIR__) . '/home.php';
   exit();
}

header('Content-Type: application/json');

?>