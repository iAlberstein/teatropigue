<?php

	$dbhost = 'localhost';
	$dbuser = 'c1382483_teatro';
	$dbpass = 'mePU03vugo';
	$dbname = 'baseDatos';

	$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Ocurrio un error al conectarse al servidor mysql');
	mysql_select_db($dbname);
?>
