<?php
include '../SQLite/database.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents('php://input'), true);

// Basic validation
if (!isset($data['id']) || !isset($data['val']) || !isset($data['lang'])) {
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$id = $data['id'];
$val = $data['val'];
$lang = $data['lang']; // Get the language parameter

// Ensure the language is one of the expected values to prevent SQL injection
$allowedLanguages = ['en', 'de', 'ru', 'wash'];
if (!in_array($lang, $allowedLanguages)) {
    echo json_encode(['error' => 'Invalid language']);
    exit;
}

$stmt = $db->prepare("UPDATE mappings SET $lang = ? WHERE id = ?");

if (!$stmt) {
    echo json_encode(['error' => 'Failed to prepare statement']);
    exit;
}

// Bind parameters
$stmt->bindValue(1, $val, SQLITE3_TEXT);
$stmt->bindValue(2, $id, SQLITE3_INTEGER);

// Error handling for the execute function
if (!$stmt->execute()) {
    echo json_encode(['error' => 'Failed to update data', 'db_error' => $db->lastErrorMsg()]);
    exit;
}

echo json_encode(['message' => 'Data updated successfully', 'id' => $id, 'val' => $val, 'lang' => $lang]);
?>
