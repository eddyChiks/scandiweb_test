<?php
class DBConnect
{
	public $server = "localhost";
	public $user = "id19557233_admin";
	public $password="sHG{vSrc2X0(LbSg";
	public $dbname="id19557233_test";
	public $conn;
	public function __construct()
	{
		$this->conn =new mysqli($this->server,$this->user,$this->password,$this->dbname);
		if($this->conn->connect_error)
		{
			die("Connection error:" .$this->conn->connect_error);
		}
	}
}
?>