<?php
session_start(); 

include "connessione.php";
$connessione = new mysqli($hostname, $username, $password, "volontariato");
if ($connessione->connect_error) {
    die("Connessione fallita: " . $connessione->connect_error);
}

if (isset($_POST['email']) && isset($_POST['password'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT ID, password FROM utente WHERE mail = ?";
    if ($stmt = $connessione->prepare($sql)) {
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            if ($password === $user['password']) {
                $_SESSION['user_id'] = $user['ID'];
                
                //header("Location: index.php");
                exit;
            } else {
                echo "Password errata.";
            }
        } else {
            echo "Utente non trovato.";
        }
    } else {
        echo "Errore nella preparazione della query.";
    }
    $connessione->close();
} else {
    echo "Per favore inserisci email e password.";
}
?>
