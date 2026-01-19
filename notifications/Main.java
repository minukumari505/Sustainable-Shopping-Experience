import client.MessageQueueClient;
import client.PubSubClient;
import sender.MqSender;
import sender.PubSubSender;
import service.NotificationService;

public class Main {

    public static void main(String[] args) {
        // MQ
        NotificationService mqService = new NotificationService(
                new MqSender(new MessageQueueClient())
        );
        mqService.sendNotification("Order Created via MQ");

        // PubSub
        NotificationService pubSubService = new NotificationService(
                new PubSubSender(new PubSubClient())
        );
        pubSubService.sendNotification("Payment Received via PubSub");
    }
}
