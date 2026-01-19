package sender;

import client.KafkaClient;

public class KafkaSender implements INotificationSender {

    private final KafkaClient kafkaClient;

    public KafkaSender(KafkaClient kafkaClient) {
        this.kafkaClient = kafkaClient;
    }

    @Override
    public void send(String message) {
        kafkaClient.produce(message);
        System.out.println("Message sent via Kafka: " + message);
    }
}
