import sender.INotificationSender;
public class NotificationService {

    private INotificationSender sender;

    public NotificationService(INotificationSender sender) {
        this.sender = sender;
    }

    public void sendNotification(String message) {
        sender.send(message);
    }
}
