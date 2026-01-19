package client;

public class EmailClient {

    public void sendEmail(String from, String to, String subject, String body) {
        // simulate sending an email
        System.out.printf("Sending email from %s to %s: [%s] %s%n", from, to, subject, body);
    }
}
