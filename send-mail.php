<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $message = $_POST['message'] ?? '';
    $type = $_POST['project_type'] ?? $_POST['job_type'] ?? '';

    $to = "malikjimi92@gmail.com"; 
    $subject = "New Submission from $name";
    $body = "Name: $name\nEmail: $email\nType: $type\nMessage: $message";
    $headers = "From: $email";

    if(mail($to, $subject, $body, $headers)){
        echo "Mail sent successfully!";
    } else {
        echo "Failed to send mail.";
    }
}
?>
