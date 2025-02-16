<?php
class User {
    private $conn;
    private $table = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register($name, $email, $password, $role, $car_number = null, $car_details = null, $preferred_location = null) {
        if ($this->emailExists($email)) {
            return ["status" => false, "message" => "Email already registered."];
        }

        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $query = "INSERT INTO " . $this->table . " (name, email, password, role, car_number, car_details, preferred_location) 
                  VALUES (:name, :email, :password, :role, :car_number, :car_details, :preferred_location)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $hashed_password);
        $stmt->bindParam(":role", $role);
        $stmt->bindParam(":car_number", $car_number);
        $stmt->bindParam(":car_details", $car_details);
        $stmt->bindParam(":preferred_location", $preferred_location);

        if ($stmt->execute()) {
            return ["status" => true, "message" => "User registered successfully."];
        } else {
            return ["status" => false, "message" => "Failed to register user."];
        }
    }

    public function login($email, $password) {
        $query = "SELECT * FROM " . $this->table . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($password, $user["password"])) {
                return ["status" => true, "user" => $user];
            } else {
                return ["status" => false, "message" => "Invalid password."];
            }
        } else {
            return ["status" => false, "message" => "User not found."];
        }
    }

    private function emailExists($email) {
        $query = "SELECT id FROM " . $this->table . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
?>
