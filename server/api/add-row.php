<?php
include '../SQLite/database.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents('php://input'), true);

// Basic validation
if (!isset($data['tablerow']) || !isset($data['val'])) {
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$tablerow = $data['tablerow'];
$val = $data['val'];

$stmt = $db->prepare('INSERT INTO mappings (tablerow, val) VALUES (?, ?)');

if (!$stmt) {
    echo json_encode(['error' => 'Failed to prepare statement']);
    exit;
}

// Bind parameters
$stmt->bindValue(1, $tablerow, SQLITE3_TEXT);
$stmt->bindValue(2, $val, SQLITE3_TEXT);

// Error handling for the execute function
if (!$stmt->execute()) {
    echo json_encode(['error' => 'Failed to insert data']);
    exit;
}

$lastId = $db->lastInsertRowID();

$newRow = [
    'id' => $lastId,
    'tablerow' => $tablerow,
    'val' => $val
];

echo json_encode($newRow);
?>
