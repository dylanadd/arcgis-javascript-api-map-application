 <?php

// echo "<pre>XXX";
print_r($_POST);
//var_dump(json_decode($_POST[0]));
//echo "</pre>";


 //echo "<pre>" . $content . "</pre>";
 
/*
 
 $list = array (
    array('aaa1', 'bbb', 'ccc', 'dddd'),
    array('123', '456', '789'),
    array('"aaa"', '"bbb"')
);
 
 

$fp = fopen('file.csv', 'w');

foreach ($list as $fields) {
    fputcsv($fp, $fields);
	echo "<pre>";
	print_r($fields);
	echo "</pre>";
}

fclose($fp);

if($x){
header("Location: file.csv");
}
*/

$fp = fopen('file.csv', 'w');


    fwrite($fp, implode($_POST));
	


fclose($fp);

?>