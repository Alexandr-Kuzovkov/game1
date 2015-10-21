<?php
	require_once("include/lib/Http.class.php");
	require_once("include/conf.php");
	
	const BASE_URL = 'ftp://ftp.ncdc.noaa.gov/pub/data/gsod/';
	const START_YEAR = 2009;
	const END_YEAR = 2009;

	for ( $year = START_YEAR; $year <= END_YEAR; $year++ )
	{
		$url = BASE_URL . $year . '/gsod_'. $year . '.tar'; 
		$filename = ''. $year . '.tar';
		echo ( Http::download($url, DATA_DIR . $filename) )? "\nFile $filename download success!\n" : "\nFail download $filename\n";	
	}
	echo "\nDone";
	