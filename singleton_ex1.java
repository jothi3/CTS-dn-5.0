public class Logger {

    // Private static instance of the class
    private static Logger instance;

    // Private constructor prevents instantiation from other classes
    private Logger() {
        System.out.println("Logger instance created.");
    }

    // Public method to provide access to the single instance
    public static Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }
        return instance;
    }

    // Sample logging method
    public void log(String message) {
        System.out.println("LOG: " + message);
    }
}
