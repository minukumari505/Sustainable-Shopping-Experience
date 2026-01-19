package sender;

import client.EmailClient;

public class EmailSender implements INotificationSender {

    private final EmailClient emailClient;

    public EmailSender(EmailClient emailClient) {
        this.emailClient = emailClient;
    }

    @Override
    public void send(String message) {
        emailClient.sendEmail("no-reply@yourapp.com", "user@example.com", "Notification", message);
        System.out.println("Email sent: " + message);
    }
}
