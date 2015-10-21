<?php

class Http
{
    /**
     * @var const string PROTOCOL Protocol type
     */
    const PROTOCOL = 'http://';
    
    /**
     * @var const string LOG_FILE Log file
     */
    const LOG_FILE = 'log/http.txt';
    
    /**
     * @var const string COOKIE_FILE Cookie file
     */
    const COOKIE_FILE = 'cookie.txt';
    
    /**
     * @var const string USER_AGENT User-Agent string
     */
    const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.117 Safari/537.36';

    /**
     * function GetUrlFromFile read url from text file
     * @param string $filename Full path to file
     * @return string $url Site url
     */
    public static function GetUrlFromFile( $filename )
    {
        $url = false;

        if ( file_exists( $filename ) )
        {
            $url = file_get_contents( $filename );
        }

        return $url;
    } //end func
    
    
    /**
     * GetNameFromUrl extract domain name from url
     * @param string $url Url
     * @return string $url Domen name
     */
    public static function GetNameFromUrl( $url )
    {
        if ( strpos( $url, self::PROTOCOL ) === 0 )
        {
            $url = str_replace( self::PROTOCOL, '', $url );
        }

        if ( strpos( $url, '/' ) !== false )
        {
            $url = substr( $url, 0, strpos( $url, '/' ) );
        }

        return $url;
    }

    
	 /**
	 * function download 
	 * @param string $url Url
	 * @param string $filename filename for write
	 * @return bool true or false
	 */
    public static function download( $url, $filename )
    {
        $result     = false;
        $curlHandle = curl_init( $url );
        if ( $curlHandle === false )
        {
            return false;
        }
       
		if ( !($f = @fopen( $filename, 'w' ))) return false;
		
        curl_setopt( $curlHandle, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt( $curlHandle, CURLOPT_FOLLOWLOCATION, 1 );
		curl_setopt( $curlHandle, CURLOPT_NOPROGRESS, 0 );
		curl_setopt( $curlHandle, CURLOPT_FILE, $f );
        
		curl_exec( $curlHandle );
        $info    = curl_getinfo( $curlHandle );
        $error   = curl_error( $curlHandle );
       
        if ( ! curl_errno( $curlHandle ) )
        {
            $result = true;
        }
		fclose($f);
        curl_close( $curlHandle );
        return $result;
    } //end func
	
	/**
     * function GetContentFromUrl get content as string from given url
     * @param string $url Url
     * @return string $content | false Content or false if fail
     */
    public static function GetContentFromUrl( $url, $filename )
    {
        $result     = false;
        $curlHandle = curl_init( $url );
        if ( $curlHandle === false )
        {
            return false;
        }

        $logFile = @fopen( self::LOG_FILE, 'a+' );

        curl_setopt( $curlHandle, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt( $curlHandle, CURLOPT_FOLLOWLOCATION, 1 );

        if ( $logFile )
        {
            curl_setopt( $curlHandle, CURLOPT_STDERR, $logFile );
        }

        $content = curl_exec( $curlHandle );
        $info    = curl_getinfo( $curlHandle );
        $error   = curl_error( $curlHandle );

        
        if ( class_exists( 'Logger' ) )
        {
            $logInfo = array( 
                            $info['url'], 
                            $info['total_time'], 
                            $info['download_content_length'], 
                            $error
                        );
            Logger::write( join( ', ', $logInfo ) );
        }
        
        if ( ! curl_errno( $curlHandle ) )
        {
            $result = true;
        }

        if ( $logFile )
        {
            fclose( $logFile );
        }
        curl_close( $curlHandle );

        return ( $result ) ? $content : false;
    } //end func
	

    /**
     * function GetPathFromUrl extract path from url
     * @param string $url Path in Url
     * @return string $path path from Url
     */
    public static function GetPathFromUrl( $url )
    {
        if ( strpos( $url, self::PROTOCOL ) === 0 )
        {
            $url = str_replace( self::PROTOCOL, '', $url );
        }

        if ( strpos( $url, '/' ) === false )
        {
            $url = self::PROTOCOL . $url . '/';
        }
        else
        {
            $url = self::PROTOCOL . substr( $url, 0, strrpos( $url, '/' ) ) . '/';
        }

        return $url;
    } //end func
    
    
     /**
     * function ConvertArrayToPostString Converting
     *  array contains POST
     *  data to POST string
     * in rawurlencode format
     * @param array $array POST param array
     * @return string $post POST string param
     */
     public static function ConvertArrayToPostString( $array )
     {
        $post = '';
        $len = count( $array );
        if ( is_array( $array ) && $len )
        {
            $count = 0;
            foreach( $array as $key  => $value )
            {
                $post .= trim( $key ) . '=' . rawurlencode( trim( $value ) );
                $count++;
                if( $count < $len ) $post .= '&'; 
            }
        }
        return $post;
     } //end func
     
     
     /**
     * function SendRequest send Http request
     * @param string $url Url
     * @param boolean $typePost GET request or POST request
     * @param  array $headers Array of headers string ( "Name: value" ) 
     * @param  string $post POST-data string
     * @param  string $referer Referef string
     * @return string $content | false Content or false if fail
     */
     public static function SendRequest( $url, $typePost = false, $headers = array(), $post = 'op=0', $referer = '' )
     {
        $result     = false;
        $curlHandle = curl_init( $url );
        if ( $curlHandle === false )
        {
            return false;
        }

        $logFile = @fopen( self::LOG_FILE, 'a+' );

        curl_setopt( $curlHandle, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt( $curlHandle, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt( $curlHandle, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt( $curlHandle, CURLOPT_FOLLOWLOCATION, 1 );
        curl_setopt( $curlHandle, CURLOPT_COOKIEJAR, trim(self::COOKIE_FILE) );
        curl_setopt( $curlHandle, CURLOPT_COOKIEFILE, trim( self::COOKIE_FILE) );
        curl_setopt( $curlHandle, CURLOPT_HTTPHEADER, $headers );
        curl_setopt( $curlHandle, CURLOPT_USERAGENT, self::USER_AGENT );
		
		
        if ( $referer != '' )
            curl_setopt( $curlHandle, CURLOPT_REFERER, $referer );
        if ( $typePost )
        {
            curl_setopt( $curlHandle, CURLOPT_POST, 1 );
            curl_setopt( $curlHandle, CURLOPT_POSTFIELDS, $post );
        }
        if ( $logFile )
        {
            curl_setopt( $curlHandle, CURLOPT_STDERR, $logFile );
        }

        $content = curl_exec( $curlHandle );
        $info    = curl_getinfo( $curlHandle );
        $error   = curl_error( $curlHandle );

        if ( class_exists( 'Logger' ) )
        {
            $logInfo = array( 
                            $info['url'], 
                            $info['total_time'], 
                            $info['download_content_length'], 
                            $error
                        );
            Logger::write( join( ', ', $logInfo ) );
        }

        if ( ! curl_errno( $curlHandle ) )
        {
            $result = true;
        }

        if ( $logFile )
        {
            fclose( $logFile );
        }
        curl_close( $curlHandle );

        return ( $result ) ? $content : false;
     }//end func
	 
	 
     
     /**
     * function ClearSession Clear cookie file
     */
     public static function ClearSession()
     {
        if( $f = @fopen( self::COOKIE_FILE, "w" ) )
        {
            fclose( $f );
        }
        
     }//end func
     
     /**
     * function UploadFile Upload file to server
     * @param string $url Url
     * @param string $filename Name of file to upload
     * @param string $filefield Name of field file
     * @param  array $headers Array of headers string ( "Name: value" )
     * @param  array $post POST-data array
     * @param  string $fileCookie File for save cookie
     * @return string $content | false Content or false if fail
     */
     public static function UploadFile( $url, $filename, $filefield, $headers = array(), $post = array(), $referer = '' )
     {
        $result     = false;
        if ( ! file_exists( $filename ) ) return false;
        
        $curlHandle = curl_init( $url );
        if ( $curlHandle === false )
        {
            return false;
        }

        $logFile = @fopen( self::LOG_FILE, 'a+' );
        $post[$filefield] = '@' . $filename;
        curl_setopt( $curlHandle, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt( $curlHandle, CURLOPT_FOLLOWLOCATION, 1 );
        curl_setopt( $curlHandle, CURLOPT_COOKIEJAR, trim(self::COOKIE_FILE) );
        curl_setopt( $curlHandle, CURLOPT_COOKIEFILE, trim( self::COOKIE_FILE) );
        curl_setopt( $curlHandle, CURLOPT_HTTPHEADER, $headers );
        curl_setopt( $curlHandle, CURLOPT_USERAGENT, self::USER_AGENT );
        if ( $referer != '' )
        {
            curl_setopt( $curlHandle, CURLOPT_REFERER, $referer );
        }

        //curl_setopt( $curlHandle, CURLOPT_UPLOAD, 0 );
        //curl_setopt( $curlHandle, CURLOPT_PUT, 0 );
        curl_setopt( $curlHandle, CURLOPT_POST, 1 );
        //curl_setopt( $curlHandle, CURLOPT_INFILE, $file );
        //curl_setopt( $curlHandle, CURLOPT_INFILESIZE, filesize( trim( $filename ) ) );            
        curl_setopt( $curlHandle, CURLOPT_POSTFIELDS, $post );
        
        if ( $logFile )
        {
            curl_setopt( $curlHandle, CURLOPT_STDERR, $logFile );
        }

        $content = curl_exec( $curlHandle );
        $info    = curl_getinfo( $curlHandle );
        $error   = curl_error( $curlHandle );

        if ( class_exists( 'Logger' ) )
        {
            $logInfo = array( 
                            $info['url'], 
                            $info['total_time'], 
                            $info['download_content_length'], 
                            $error
                        );
            Logger::write( join( ', ', $logInfo ) );
        }

        if ( ! curl_errno( $curlHandle ) )
        {
            $result = true;
        }

        if ( $logFile )
        {
            fclose( $logFile );
        }
        curl_close( $curlHandle );
        return ( $result ) ? $content : false;
     }//end func
     

} //end class
