<?php
// SQLite3 wrapper
class Database {
    private $db;

    public function __construct($filename) {
        $this->db = new SQLite3($filename);
        if (!$this->db) {
            die("Failed to connect to database: " . $this->db->lastErrorMsg());
        }
    }

    public function query($sql) {
        return $this->db->query($sql);
    }

    public function prepare($sql) {
        return $this->db->prepare($sql);
    }

    public function lastInsertRowID() {
        return $this->db->lastInsertRowID();
    }
}

$db = new Database('../SQLite/mappings.sqlite');

// General purpose Database (both work 🤷‍♂️) 
// $db = new PDO('sqlite:mappings.sqlite');

?>
