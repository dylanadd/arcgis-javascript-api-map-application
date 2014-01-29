 <?php

$temp = json_decode($_POST['work']);

//print_r($temp->export[0]);


function udate($format = 'u', $utimestamp = null) {
        if (is_null($utimestamp))
            $utimestamp = microtime(true);

        $timestamp = floor($utimestamp);
        $milliseconds = round(($utimestamp - $timestamp) * 1000000);

        return date(preg_replace('`(?<!\\\\)u`', $milliseconds, $format), $timestamp);
    }

//echo udate('Y-m-d-s_u');
$filename = udate('Y-m-d-s_u') . '.csv';
//echo $filename;
 
/*
 
 $list = array (
    array('aaa1', 'bbb', 'ccc', 'dddd'),
    array('123', '456', '789'),
    array('"aaa"', '"bbb"')
);
 
 

$fp = fopen('file.csv', 'w');

foreach ($list as $fields) {
    fputcsv($fp, $fields);
	
}

fclose($fp);

if($x){
header("Location: file.csv");
}
*/
$i=0;
$fp = fopen('temp/' . $filename, 'w');
$z = array('Parcel Number','FIPS','Owner Name', 'Owner Overflow', 'Owner Street','Owner City','Owner State', 'Owner Zip', 'Owner Country', 'Tax District', 'Subdivision', 'Zoning', 'Legal Description', 'Land Assessed Value', 'Land Actual Value','Improvements Assessed Value', 'Improvements Actual Value', 'Fire', 'Property Tax');
$a = array('Address Number', 'Facility Name', 'Full Address');
$b = array('Address','Geocoder Score');
$c = array('Road Name', 'City');
$top = true;
//fputcsv($fp,$z);
$tf = false;
foreach($temp->export as $result){
	if(isset($result->$i->parcelNum)){
		$g = $z;
	$y = array($result->$i->parcelNum, $result->$i->Fips, $result->$i->Owner, $result->$i->OwnerOverflow, $result->$i->OwnerStreetAddress, $result->$i->OwnerCity, $result->$i->OwnerState, $result->$i->OwnerZip, $result->$i->OwnerCountry, $result->$i->TaxDistrict, $result->$i->Subdivision, $result->$i->Zoning, $result->$i->LegalDescription, $result->$i->LandAssessedValue, $result->$i->LandActualValue, $result->$i->ImprovementsAssessedValue, $result->$i->ImprovementsActualValue, $result->$i->Fire, $result->$i->PropertyTax);
	} else if(isset($result->$i->FullAddress)){
		$g = $a;
		$y = array($result->$i->AddressNumber, $result->$i->FacilityName, $result->$i->FullAddress);
	} else if(isset($result->$i->Score)){
		$g = $b;
		$y = array($result->$i->Address, $result->$i->Score);
	} else if(isset($result->$i->AltName)){
		$g = $c;
		$y = array($result->$i->AltName, $result->$i->City);
	}
	
	if($top){
		$top = false;
		$tf = (fputcsv($fp,$g));
	}	
	$tf = (fputcsv($fp,$y));
	//print_r($result->$i->parcelNum);
	$i++;
}

if ($tf != FALSE){
	echo $filename;
} else {
	echo "false";
}


     
	


fclose($fp);
//return "x";
//header("Location: " . $filename);
?>