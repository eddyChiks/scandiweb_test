<?php
include 'db.php';

abstract class Product
{
	protected $sku;
	protected $name;
	protected $price;
	protected $product_type;
	public function __construct($data)
	{
		$this->sku=$data['sku'];
		$this->name=$data['name'];
		$this->price=$data['price'];
		$this->product_type=$data['product_type'];
	}
	public function get_sku()
	{
		return $this->sku;
	}
	public function get_name()
	{
		return $this->name;
	}
	public function get_price()
	{
		return $this->price;
	}
	public function get_product_type()
	{
		return $this->product_type;
	}
	abstract function validate();

	public function save()
	{
		if($this->validate())
		{
			return $this->validate();
		}
		$db = new DBConnect();
		[$sku,$name,$price,$product_type]=array($this->get_sku(),$this->get_name(),$this->get_price(),$this->get_product_type());
		$values = "'{$sku}','{$name}',{$price}";
		$sql1 = "INSERT INTO Product(sku,name,price)VALUES({$values})";
		if ($db->conn->query($sql1) === FALSE) {
			return $db->conn->error;
			}
		$id_query = "SELECT ID FROM Product WHERE sku='{$sku}'";
		$result = $db->conn->query($id_query) or die(json_encode(array('error'=>$db->conn->error)));
		$id = $result->fetch_assoc()['ID'];
		$values="{$id},${values}";
		$extra_values=",";
		$reflect = new ReflectionClass($this);
		$props  = $reflect->getProperties(ReflectionProperty::IS_PUBLIC | ReflectionProperty::IS_PROTECTED | ReflectionProperty::IS_PRIVATE);
		$props_names=[];
		foreach($props as $prop){
			array_push($props_names,$prop->getName());
		}
		$split_index = array_search('sku',$props_names);
		$props_names = array_slice($props_names,0,$split_index);
		foreach($props_names as $prop_name){
			$getter = "get_{$prop_name}";
			$val = $this->$getter();
			$extra_values=$extra_values."{$val}".",";
		}
		$extra_values=substr($extra_values,0,-1);
		$sql2= "INSERT INTO {$product_type} VALUES(".$values.$extra_values.")";
		if ($db->conn->query($sql2) === FALSE) 
		{
		    header('Content-Type: application/json');
		    die(json_encode(array('error'=>$db->conn->error)));
			return $db->conn->error;
		}
		$db->conn->close();
	}
}

class DVD extends Product
{
	private $size;
	public function __construct($data)
	{
		parent::__construct($data);
		$this->size=$data['size'];
	}
	public function get_size()
	{
		return $this->size;
	}
	public function validate()
	{
		[$sku,$name,$price,$size]=array($this->get_sku(),$this->get_name(),$this->get_price(),$this->get_size());
		if($price<=0 || $size<=0)
		{
			return "Please, provide the data of indicated type";
		}
	}
}

class Furniture extends Product
{
	private $height;
	private $width;
	private $length;
	public function __construct($data){
		parent::__construct($data);
		$this->height=$data['height'];
		$this->width=$data['width'];
		$this->length=$data['length'];
	}
	public function get_height()
	{
		return $this->height;
	}
	public function get_width()
	{
		return $this->width;
	}
	public function get_length()
	{
		return $this->length;
	}
	public function validate(){
		[$sku,$name,$price,$height,$width,$length]=array($this->get_sku(),$this->get_name(),$this->get_price(),$this->get_height(),$this->get_width(),$this->get_length());
		if($price<=0 || $height<=0 || $width<=0 || $length<=0)
		{
			return "Please, provide the data of indicated type";
		}		
	}
}

class Book extends Product
{
	private $weight;
	public function __construct($data)
	{
		parent::__construct($data);
		$this->weight=$data['weight'];
	}
	public function get_weight()
	{
		return $this->weight;
	}
	public function validate()
	{
		[$sku,$name,$price,$weight]=array($this->get_sku(),$this->get_name(),$this->get_price(),$this->get_weight());
		if($price<=0 || $weight<=0)
		{
			return "Please, provide the data of indicated type";
		}
	}
}
?>