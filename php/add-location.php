<?php

// include, include_once, require, require_once
include_once "lib/php/print_o.php";

// instantiate variables
$filename = "data/myjson.json";
$file = file_get_contents($filename);
// echo $file;
$data = json_decode($file);
// echo $data;
// echo "<pre>",print_r($data),"</pre><hr>";
// echo $data->users[2]->name;
//print_o($data);

// HINT #1: json_encode()
// HONT #2: file_put_contents()

$empty_location = (object)array(
	"id"=>"",
	"date"=>"",
	"lat"=>"",
	"lng"=>"",
	"confession"=>""
	);

currentAnimal()[0].locations.push({
			"id": currentAnimal()[0].locations.length,
            "date": dayjs().format("YYYY-MM-dd hh:mm:ss"),
            "lat": +$("#new-location-lat").val(),
            "lng": +$("#new-location-lng").val(),
            "confession": $("#new-location-description").val(),
		})


if(isset($_GET['action'])) {
	if($_GET['action']=="create") {
		$empty_location->date = $_POST[date("Y-m-d h:i:sa")];
		$empty_location->lat = $_POST['user-age'];
		$empty_location->lng = $_POST['user-type'];

		$new_id = count($data->users);
		$data->users[] = $empty_user;

		$jsondata = json_encode($data);
		file_put_contents($filename, $jsondata);

		// header requires that no other text be written on the page
		header("location:?id=$new_id");
	}
	else if($_GET['action']=="update") {
		$data->users[$_GET['id']]->name = $_POST['user-name'];
		$data->users[$_GET['id']]->age = $_POST['user-age'];
		$data->users[$_GET['id']]->type = $_POST['user-type'];

		$jsondata = json_encode($data);
		file_put_contents($filename, $jsondata);
		header("location:?id={$_GET['id']}&msg=success");
	}
	else if($_GET['action']=="delete") {
		array_splice($data->users,$_GET['id'],1);

		$jsondata = json_encode($data);
		file_put_contents($filename, $jsondata);
		header("location:friends.php");
	}
}




print_o($_POST);

// make functions
// global vs local
function printUser($user){

	$action = $_GET['id']=="new" ? "create" : "update";
	
	if($_GET['id']!="new") {
		echo "[<a href='?action=delete&id={$_GET['id']}'>delete</a>]";
	}

	?>

	<form class="user" action="friends.php?action=<?= $action?>&id=<?= $_GET['id']?>" method="post">
		<div class="user-name">
			<label>Name</label>
			<input type="text" name="user-name" value="<?= $user->name ?>">
		</div>
		<div>
			<label>Age</label>
			<input type="text" name="user-age" value="<?= $user->age ?>">
		</div>
		<div>
			<label>Job</label>
			<input type="text" name="user-type" value="<?= $user->type ?>">
		</div>
		<div>
			<label></label>
			<input type="submit" value="Submit">
		</div>
	</form>
	<?php
}



?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Friends</title>

</head>
<body>

	<?php 
	//include "../m08/partials/header.html";
	?>

	<ol>
	<?php
	for($i=0; $i<count($data->notes); $i++){
		echo "<li> {$data->notes[$i]}</li>";
	}
	?>
	</ol>

	<?php


	if(isset($_GET['msg'])) {
		echo "<div>".$_GET['msg']."</div>";
	}



	if(isset($_GET['id'])) {
		// Show one user's information

		// ternary ?:
		$user = $_GET['id']=="new" ?
			$empty_user :
			$data->users[$_GET['id']];
		printUser($user);
		echo "<a href='friends.php'>Back</a>";
	} else {
		// Show the user list
		echo "<a href='?id=new'>Add New User</a><hr>";
		foreach($data->users as $id=>$value) {
			echo "
			<div class='user'>
				<span>$value->name</span>
				<a href='?id=$id'>&gt;</a>
			</div>
			";
		}
	}
	?>
</body>
</html>