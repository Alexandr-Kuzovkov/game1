<?php
	interface IParser
	{
		public function __construct(IStorage $storage);
		public function parseMeteoDataFiles($dir);
		public function parseStationsDataFile($file);
	
	}