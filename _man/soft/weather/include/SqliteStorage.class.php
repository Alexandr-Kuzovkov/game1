<?php

class SqliteStorage implements IStorage
{
	private $db;
	private $file;
	private $model;
	private $buffer = array();
	const BUFFER_SIZE = 1000;
	
	public function __construct($file)
	{
		$this->file = $file;
		$this->db = new SQLite3($file);
		$sql = "PRAGMA journal_mode = PERSIST";
		$this->db->exec($sql);
	}

	public function setModel(array $model)
	{
		$this->model = $model;
		foreach($this->model as $name => $schema)
		{
			$sql = 'CREATE TABLE IF NOT EXISTS ' . $name . '(';
			$count = 0; $len = count($this->model[$name]);
			foreach( $schema as $key=>$value)
			{
				$sql .= $key;
				$count++;
				if ($count < $len) $sql .= ',';
			}
			$sql .= ')';
			$this->db->exec($sql);
		}
	}
	
	
	public function save(array $record, $name)
	{
		$bufferSize = (isset($this->buffer[$name]))? count($this->buffer[$name]) : 0;
		if ( $bufferSize >= self::BUFFER_SIZE )
		{
			$this->db->exec("BEGIN");
			foreach( $this->buffer[$name] as $bufferRecord)
			{
				$sql = 'INSERT INTO ' . $name . ' (';
				$count = 0; $len = count($this->model[$name]);
				foreach( $this->model[$name] as $key=>$value)
				{
					$sql .= $key;
					$count++;
					if ($count < $len) $sql .= ',';
				}		
				$sql .= ') VALUES (';
				$count = 0;
				foreach( $this->model[$name] as $key=>$value)
				{
					$sql .= "'" . $bufferRecord[$value] . "'";
					$count++;
					if ($count < $len) $sql .= ',';
				}
				$sql .= ')';
				$this->db->exec($sql);
			}
			unset($this->buffer[$name]);
			$this->buffer[$name][] = $record;
			return $this->db->exec("COMMIT");
		}
		else
		{
			$this->buffer[$name][] = $record;
			return true;
		}
		
	}
	
	public function flush($name)
	{
		if (!isset($this->buffer[$name]) || !count($this->buffer[$name]))
		{
			return true;
		}
		$this->db->exec("BEGIN");
		foreach( $this->buffer[$name] as $bufferRecord)
		{
			$sql = 'INSERT INTO ' . $name . ' (';
			$count = 0; $len = count($this->model[$name]);
			foreach( $this->model[$name] as $key=>$value)
			{
				$sql .= $key;
				$count++;
				if ($count < $len) $sql .= ',';
			}		
			$sql .= ') VALUES (';
			$count = 0;
			foreach( $this->model[$name] as $key=>$value)
			{
				$sql .= "'" . $bufferRecord[$value] . "'";
				$count++;
				if ($count < $len) $sql .= ',';
			}
			$sql .= ')';
			$this->db->exec($sql);
		}
		unset($this->buffer[$name]);
		return $this->db->exec("COMMIT");
	}

}