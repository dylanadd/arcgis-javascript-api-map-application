 <?php
//echo $_POST['work'];
 //echo "<pre>";
//print_r($_POST);
//print_r(var_dump(json_encode($_POST)));
//$temp = json_encode($_POST['work']);
//$temp = '{"array": [{' . $_POST['work']. '}] }';
$temp = json_decode($_POST['work']);

//$temp2 = json_decode($temp, true);
//echo "x";
//var_dump($_POST);
//print_r($_POST['work']);
//echo var_dump($_POST);
//print_r($temp);
//print_r($temp2);
//print_r($temp2);

print_r($temp);



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


     fwrite($fp, $_POST['work']);
	


fclose($fp);
//return "x";
?>