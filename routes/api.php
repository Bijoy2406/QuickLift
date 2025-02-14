<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../controllers/AuthController.php";

$auth = new AuthController();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ($_GET["action"] === "register") {
        $auth->register();
    } elseif ($_GET["action"] === "login") {
        $auth->login();
    }
}
?>
