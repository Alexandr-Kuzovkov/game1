<?php
	require_once('include/common.inc.php');
				
	
	$storage = new SqliteStorage('stations.sqlite');
	$parser = new GsodParser($storage);
	
	echo "\nParse meteostations data: ";
	$parser->parseStationsDataFile('isd-history.csv');
	
	unset($storage);
	unset($parser);
	
	echo "\nDone";