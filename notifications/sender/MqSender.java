package sender;

import client.MessageQueueClient;

public class MqSender implements INotificationSender {

    private MessageQueueClient mqClient;

    public MqSender(MessageQueueClient mqClient) {
        this.mqClient = mqClient;
    }

    @Override
    public void send(String message) {
        mqClient.push(message);
    }
}
