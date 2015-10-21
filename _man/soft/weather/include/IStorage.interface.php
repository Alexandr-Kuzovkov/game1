<?php
	interface IStorage
	{
		public function save(array $record, $name);
		public function setModel(array $model);
		public function flush($name);
	}