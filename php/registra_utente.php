<?php
include "connessione.php";
$connessione = new mysqli($hostname, $username, $password, "ecommerce");

$nome = $connessione->real_escape_string($_POST['nome']);
$cognome = $connessione->real_escape_string($_POST['cognome']);
$eta = $connessione->real_escape_string($_POST['eta']);
$codiceFiscale = $connessione->real_escape_string($_POST['codiceFiscale']);
$cellulare = $connessione->real_escape_string($_POST['cellulare']);
$email = $connessione->real_escape_string($_POST['email']);
$password = $connessione->real_escape_string($_POST['password']); // Considera l'uso di password_hash() per una maggiore sicurezza

$sql = "SELECT * FROM utente WHERE mail = '$email'";
$result = $connessione->query($sql);
if ($result->num_rows > 0) {
    echo "Email già utilizzata. Per favore, utilizza un'altra email.";
    header("Location: registrazione.php?errore=email_usata");
    exit;
} else {
    $sql = "INSERT INTO cliente (nome, cognome, eta, codiceFiscale, cellulare, email, password) VALUES ('$nome', '$cognome', '$eta', '$codiceFiscale', '$cellulare', '$email', '$password')";
    if ($connessione->query($sql) === TRUE) {
        header("Location: ../view/login.php");
        exit;
    } else {
        echo "Errore durante la registrazione: " . $connessione->error;
    }
}

$connessione->close();
?>
