import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoggingExample {

    // Create logger object
    static Logger log = LoggerFactory.getLogger(LoggingExample.class);

    public static void main(String[] args) {

        log.warn("Warning: Check your input.");

        log.error("Error: Something went wrong.");

    }
}