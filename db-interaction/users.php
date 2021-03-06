<?php

session_start();

include_once "../inc/constants.inc.php";
include_once "../inc/class.users.inc.php";
$userObj = new ListUsers();

if ($_POST['token'] == $_SESSION['token'] && !empty($_POST['action']) && isset($_SESSION['LoggedIn']) && $_SESSION['LoggedIn'] == 1)
{
	switch($_POST['action'])
	{
		case 'changeemail':
			$status = $userObj->updateEmail() ? "changed" : "failed";
			header("Location: ../account.php?email=$status");
			break;
		case 'changepassword':
			$status = $userObj->updatePassword() ? "changed" : "nomatch";
			header("Location: ../account.php?password=$status");
			break;
		case 'deleteaccount':
			$userObj->deleteAccount();
			break;
		default:
			header("Location: ../index.php");
			break;
	}
}

else if($_POST['action'] == "resetPassword")
{
	if($resp = $userObj->resetPassword() === TRUE)
	{
		header("Location: ../resetPending.php");
	}
	else
	{
		echo $resp;
	}
	exit;
}
else
{
	header("Location: ../index.php");
	exit;
}

?>
