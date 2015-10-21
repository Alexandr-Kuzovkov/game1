<?php
	class Logger
	{
		private $outLen = 0;
		
		public function progress($count, $full, $prefix = "Progress: ", $suffix = "%")
		{
			for ( $j = 0; $j < $this->outLen; $j++ )
			{
				print "\x08";
			}
			$out = $prefix . round(( $count / $full * 100 ), 3) . $suffix;
			printf("%s", $out);
			$this->outLen = strlen($out);
		}	
	}