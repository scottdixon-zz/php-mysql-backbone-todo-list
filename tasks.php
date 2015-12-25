<?php
    // host must set by IP;or it will throw an error 'PDOException SQLSTATE[HY000] [2002]...'
    // the 3rd parameter should be Password,i just ignore it cause i didnt set a password;
	$db = new PDO("mysql:host=127.0.0.1;port=3306;dbname=tasks", "root");
	$data = json_decode(file_get_contents('php://input'));
    
	if ($_SERVER['REQUEST_METHOD'] == "GET"){
		$statement = $db->query('SELECT * FROM tasks');
		$statement->setFetchMode(PDO::FETCH_ASSOC);
		echo json_encode($statement->fetchAll());
	}

	if ($_SERVER['REQUEST_METHOD'] == "POST"){
		$sql = "INSERT INTO tasks (title) values (:title)";
		$query = $db->prepare($sql);
		$query->execute(array(":title"=>$data->title));// here should set a default value for 'done',so i modified the sql sentence [tasks.sql,line 8]
		$result['id'] = $db->lastInsertId();
		echo json_encode($result);
	}

	if ($_SERVER['REQUEST_METHOD'] == "PUT"){
		$sql = "UPDATE tasks SET done = :done WHERE id = :id";
		$query = $db->prepare($sql);
		$query->execute(array(":done"=>$data->done, ":id"=>$data->id));
	}
	
	if ($_SERVER['REQUEST_METHOD'] == "DELETE"){
		$sql = "DELETE FROM tasks WHERE id = :id";
		$query = $db->prepare($sql);
		$query->execute(array(":id"=>$_GET['id']));
	}

?>