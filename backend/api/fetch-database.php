<?php  
include '../SQLite/database.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");


$stmt = $db->query('SELECT * FROM mappings');

$results = [];
while ($row = $stmt->fetchArray(SQLITE3_ASSOC)) {
    $results[] = $row;
}

echo json_encode($results);
?>
