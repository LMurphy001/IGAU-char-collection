<?php

function displayArrayInHTML($arr,$indent){
	$front = sprintf("%".$indent."s", " ");
	$front = str_replace(" ","&nbsp;", $front);
	foreach($arr as $key => $value) {
		echo $front . $key;
		if (is_array($value)) {
			echo ":<br>\n";
			displayArrayInHTML($value, ($indent + 3) ); 
		}
		else{
			 echo '=' . $value . "<br>\n";
		}
	}
	echo "<br>\n";
}

date_default_timezone_set("America/New_York");

function getcell($type, $str)
{
	return "<t" . $type . " style='border:1px solid'>" . $str . "</t" . $type . ">\n";
}

$tocfile = "toc.txt";
$toclines = file_get_contents($tocfile);
$toclines = explode("\n", $toclines);
$toclines = array_reverse($toclines ); // put most recent lines at the top

foreach ($toclines as $line) // use &$line for reference, to change array element
{
	if(strlen($line) == 0)
		continue;
	
	$cols = explode("\t", $line);
	if (count($cols) < 3)
		continue;
	
	$filetime = $cols[0];
	$hash = $cols[1];
	$tag = $cols[2];
	$tag = str_replace ( '"' , '' , $tag );
	
	$fn = 'saves/'.$hash.".json";
	if (!file_exists($fn)) {
		continue;
	}

	$jsonstr = file_get_contents($fn);
	$decoded = json_decode ( $jsonstr, true );
	echo "<br>$tag,$filetime,$hash:<br>\n"; 
	displayArrayInHTML($decoded, 0);
}
