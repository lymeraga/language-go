package edu.brown.cs.student.main.server.Handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import spark.Request;
import spark.Response;
import spark.Route;

public class StoreScoreHandler implements Route {

  public StorageInterface storageHandler;

  public StoreScoreHandler(StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
  }

  /**
   * Invoked when a request is made on this route's corresponding path e.g. '/hello'
   *
   * @param request The request object providing information about the HTTP request
   * @param response The response object providing functionality for modifying the response
   * @return The content to be set in the response
   */
  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    try {
      // collect parameters from the request
      String score = request.queryParams("score");
      String usrId = request.queryParams("userid");

      double num = Double.parseDouble(score);

      Map<String, Object> data = new HashMap<>();

      List<Map<String, Object>> values = this.storageHandler.getCollection(usrId, "score");

      if (!values.isEmpty()) {
        if (values.get(0).get("score") != null) {

          num = Double.parseDouble(score) + (Double) values.get(0).get("score");
          data.put("tag", values.get(0).get("tag"));

          if (values.get(0).get("sessions") == null) {
            data.put("sessions", 1);
          } else {
            double sessions = Double.parseDouble(values.get(0).get("sessions").toString());
            data.put("sessions", 1 + sessions);
          }
        }
      } else {
        num = Double.parseDouble(score);
      }
      data.put("score", num);
      data.put("userid", usrId);

      // use the storage handler to add the document to the database
      this.storageHandler.addDocument(usrId, "score", usrId, data);

      responseMap.put("response_type", "success");
      responseMap.put("score", score);
      responseMap.put("userid", usrId);
    } catch (NumberFormatException e) {
      // error likely occurred in the storage handler
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    } catch (ExecutionException | InterruptedException e) {
      throw new RuntimeException(e);
    }
    return Utils.toMoshiJson(responseMap);
  }
}
