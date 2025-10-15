package edu.brown.cs.student.main.server;

import static spark.Spark.after;
import static spark.Spark.get;
import static spark.Spark.port;

import edu.brown.cs.student.main.server.Handlers.GetScoreHandler;
import edu.brown.cs.student.main.server.Handlers.StoreScoreHandler;
import edu.brown.cs.student.main.server.Handlers.UpdateTagHandler;
import edu.brown.cs.student.main.server.storage.FirebaseUtilities;
import java.io.IOException;
import spark.Spark;

/** TODO: Create our database and server endpoints. */
public class Server {

  public static void setUpServer() {
    int port = 3232;
    port(port);

    // Configure CORS settings
    after(
        (request, response) -> {
          response.header("Access-Control-Allow-Origin", "*");
          response.header("Access-Control-Allow-Methods", "*");
          response.header("Access-Control-Allow-Headers", "*");
        });
    FirebaseUtilities firebaseUtils;
    try {
      firebaseUtils = new FirebaseUtilities();
      Spark.get("storeScore", new StoreScoreHandler(firebaseUtils));
      Spark.get("getScore", new GetScoreHandler(firebaseUtils));
      Spark.get("updateTag", new UpdateTagHandler(firebaseUtils));
      // Basic "ping" endpoint to verify server is running
      get("/ping", (req, res) -> "pong");
      System.out.println("Simplified server started at http://localhost:" + port);
    } catch (IOException e) {
      e.printStackTrace();
      System.err.println(
          "Error: Could not initialize Firebase. Likely due to firebase_config.json not being found. Exiting.");
      System.exit(1);
    }
  }

  /**
   * Main method to run the server.
   *
   * @param args none
   */
  public static void main(String[] args) {
    setUpServer();
  }
}
