<?php
function doHash($hash){
	$fn = 'saves/' . $hash . ".json";
	if (file_exists($fn)){
		$data = file_get_contents($fn);
		echo "response_length=" . strlen($data) . "\n";
		echo $data;
	}
	else{
		echo "Missing file: $fn\n";
	}
}

$hash = $_POST["data"];
if (isset($hash) && $hash != '') {
	doHash($hash);
}
else {
	parse_str($_SERVER['QUERY_STRING'], $qrypairs);
	if (isset($qrypairs["id"]) && $qrypairs["id"] != ''){
		$hash = $qrypairs["id"];
		doHash($hash);
	}
	else
		echo "Hash code not received\n";
}
