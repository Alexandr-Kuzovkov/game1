<?php
	require_once('include/common.inc.php');
				
	const START_YEAR = 1994;
	const END_YEAR = 2014;
	
	for ( $year = END_YEAR; $year >= START_YEAR; $year-- )
	{
		$storage = new SqliteStorage(DB_DIR . 'weather.'.$year.'.sqlite');
		$parser = new GsodParser($storage);
		
		//echo "\nParse meteostations data for ".$year.": ";
		//$parser->parseStationsDataFile(STATIONS_FILE);
		
		echo "\nParse meteo data for ".$year.": ";
		$parser->parseMeteoDataFiles(DATA_DIR . $year . '/');
		
		unset($storage);
		unset($parser);
	}
	echo "\nDone";
	
	

	
	
	
	
	
	