<?php
include '../SQLite/database.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $tablerowValue = isset($_GET['tablerow']) ? $_GET['tablerow'] : null;
        if ($tablerowValue) {
            $stmt = $db->prepare("SELECT * FROM mappings WHERE tablerow = :tablerowValue");
            $stmt->bindValue(':tablerowValue', $tablerowValue);
            $result = $stmt->execute();
        } else {
            $result = $db->query("SELECT * FROM category_mappings");
        }
        
        $mappings = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $mappings[] = $row;
        }
        echo json_encode($mappings);
        break;
    

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $db->prepare("INSERT INTO category_mappings (original, mapped, translation) VALUES (:original, :mapped, :translation)");
        $stmt->bindValue(':original', $data['original']);
        $stmt->bindValue(':mapped', $data['mapped']);
        $stmt->bindValue(':translation', $data['translation']);
        $stmt->execute();
        echo json_encode(["message" => "Mapping added successfully!"]);
        break;

    // Add more cases for PUT, DELETE if needed

    default:
        echo json_encode(["message" => "Invalid request method"]);
        break;
}
?>
