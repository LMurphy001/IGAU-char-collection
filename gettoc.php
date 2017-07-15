<?php

date_default_timezone_set("America/New_York");

function getcell($type, $str)
{
	return "<t" . $type . " style='border:1px solid'>" . $str . "</t" . $type . ">\n";
}

$tocfile = "toc.txt";
$toclines = file_get_contents($tocfile);
$toclines = explode("\n", $toclines);
$toclines = array_reverse($toclines ); // put most recent lines at the top

$rows = "<tr>". getcell("h","Tag"). getcell("h","Time") /*. getcell("h", "Discuss")*/ . "</tr>\n";
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

	$timestr = date("m/d H:i T", $filetime);
	
	$timelinkstr = "<a href='#' onclick='CCIM_Restore.restoreFromHash(\"" . $hash . "\");'>$timestr</a>";
	$discussionlinkstr = "<a href='#' onclick='CCIM_Discuss.start(\"" . $hash . "\", \"" . $tag . "\", " .$filetime. ");'>Discuss '$tag'</a>";

	$rowstr = "<tr>";
	$rowstr .= getcell("d", $tag);
	$rowstr .= getcell("d", $timelinkstr);
	/*$rowstr .= getcell("d", $discussionlinkstr);*/
	$rowstr .= "</tr>\n";
	
	$rows = $rows . $rowstr;
}

echo "<table style='border-collapse:collapse'>\n";
echo "<caption>Saved Collections</caption>\n";
echo $rows;
echo "</table>";
