<?php
date_default_timezone_set("America/New_York");

$okay=true;

$data = $_POST["form"];
$tag = $_POST["tag"];
$hash = md5($data);
$fn = 'saves/'.$hash.".json";

if (!file_exists($fn))
{
	$fpc = file_put_contents($fn, $data);
	if ($fpc === false || $fpc === 0)
	{
		$okay = false;
		echo "Failed to save form.<br>\n";
	}
	else
	{
		echo "Form saved.<br>\n";
		$filetime = filemtime($fn);
		$tocfile = "toc.txt";
		$toc_csv_line = "$filetime\t$hash\t" . '"' . $tag . '"' . "\n";
		if (file_put_contents($tocfile, $toc_csv_line, FILE_APPEND | LOCK_EX) === false)
		{
			$okay = false;
			echo "Failed to write toc line.<br>\n";
		}
	}
}

echo "$tag: ";
if($okay)
	echo "ok ";
else
	echo "error ";

echo "<br>";
?>