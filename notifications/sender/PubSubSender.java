package sender;

import client.PubSubClient;

public class PubSubSender implements INotificationSender {

    private PubSubClient pubSubClient;

    public PubSubSender(PubSubClient pubSubClient) {
        this.pubSubClient = pubSubClient;
    }

    @Override
    public void send(String message) {
        pubSubClient.publish(message);
    }
}
