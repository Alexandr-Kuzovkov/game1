<?php

class Fs
{
	/**
	* получаем список файлов в каталоге
	* @param string $dir имя каталога
	* @return array список файлов
	**/
	public static function getFiles($dir)
	{
		$result = array();
		$files = scandir($dir);
		//print_r($files);
		foreach( $files as $file )
		{
			if ($file == '.' || $file == '..') continue;
			$result[] = $file;
		}
		return $result;
	}
	
	/**
	* получаем строки из файла
	* @param string $filename имя файла
	* @return array список строк в файле 
	**/
	public static function getRows($filename)
	{
		$rows = file($filename);
		$result = array();
		foreach($rows as $row)
		{
			if ($row == '') continue;
			$result[] = $row;
		}
		return $result;
	}
	
	/**
	* получаем элементы строки в виде массива
	* @param string $row строка
	* @param string $delimiter разделитель полей в строке
	* @return array список элементов в строке 
	**/
	public static function getItems($row, $delimiter)
	{
		$result = array();
		$items = explode($delimiter, $row);
		foreach($items as $item)
		{
			if ($item == ' ' || $item == '') continue;
			$result[] = $item;
		}
		return $result;
	}


}