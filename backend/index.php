<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include 'products.php';

new class
{
	public function __construct()
	{
		$func = isset($_POST['action'])?$_POST['action']:"show";
		$data = isset($_POST['input'])?$_POST['input']:null;
		$this->$func($data);
	}

	public function show($data)
	{
		$db = new DBConnect();
		$types = ["DVD","Furniture","Book"];
		$products=[];
		foreach($types as $type)
		{
			$sql = "SELECT * FROM {$type}";
			$result = $db->conn->query($sql);
			while($row=$result->fetch_assoc())
			{
				$row['product_type']=$type;
				$product = new $type($row);
				$reflect = new ReflectionClass($product);
				$props = $reflect->getProperties(ReflectionProperty::IS_PUBLIC | ReflectionProperty::IS_PROTECTED | ReflectionProperty::IS_PRIVATE);
				$new_product=[];
				foreach($props as $prop)
				{	
					$prop_name = $prop->getName();
					$getter = "get_{$prop_name}";
					$new_product[$prop_name]=$product->$getter();
				}
				$new_product['ID']=$row['ID'];
				array_push($products,$new_product);
			}
		}
		$IDs = array_column($products,'ID');
		array_multisort($IDs,$products);
		$db->conn->close();
		echo(json_encode($products));
	}

	public function save($data)
	{
		$class=$data['product_type'];
		$product = new $class($data);
		$message = $product->save();
		if($message)
		{
			die(json_encode(array('error'=>$message)));
		}
    	echo(json_encode(array('success'=>true)));
	}

	public function delete($data)
	{
		$sku_s = $data;
		$sql_values = "";
		foreach($sku_s as $sku){
			$sql_values=$sql_values."'$sku'".",";
		}
		$sql_values=substr($sql_values,0,-1);
		$db = new DBConnect();
		$sql = "DELETE FROM Product WHERE sku IN ($sql_values)";
		if ($db->conn->query($sql) === FALSE) 
		{
			die(json_encode(array('error'=>$db->conn->error)));
		}
		$db->conn->close();
		echo(json_encode(array('error'=>"Successfully deleted")));
	}
}
?>