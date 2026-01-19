package client;

public class MessageQueueClient {

    public void push(String message) {
        System.out.println("Pushed to MQ: " + message);
    }
}
