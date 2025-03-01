<?php
require_once "../config/database.php";
require_once "../models/User.php";

class AuthController {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->name, $data->email, $data->password, $data->role)) {
            echo json_encode(["status" => false, "message" => "Missing required fields."]);
            return;
        }

        $response = $this->user->register(
            $data->name, $data->email, $data->password, $data->role, 
            $data->car_number ?? null, $data->car_details ?? null, 
            $data->preferred_location ?? null
        );
        echo json_encode($response);
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->email, $data->password)) {
            echo json_encode(["status" => false, "message" => "Missing email or password."]);
            return;
        }

        $response = $this->user->login($data->email, $data->password);
        echo json_encode($response);
    }
}

$auth = new AuthController();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ($_GET["action"] === "register") {
        $auth->register();
    } elseif ($_GET["action"] === "login") {
        $auth->login();
    }
}
?>
