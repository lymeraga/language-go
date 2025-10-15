package edu.brown.cs.student.main.server.Handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import spark.Request;
import spark.Response;
import spark.Route;

public class UpdateTagHandler implements Route {

  public StorageInterface storageHandler;

  public UpdateTagHandler(StorageInterface storageHandler) {
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
      String tag = request.queryParams("tag");
      String usrId = request.queryParams("userid");

      double score = 0;
      double sessions = 0;
      List<Map<String, Object>> values = this.storageHandler.getCollection(usrId, "tag");
      System.out.println(values);
      if (values != null) {
        if (!values.isEmpty()) {
          if (values.get(0).get("score") != null) {
            score = Double.parseDouble(values.get(0).get("score").toString());
            sessions = Double.parseDouble(values.get(0).get("sessions").toString());
          }
        }
      }
      Map<String, Object> data = new HashMap<>();
      data.put("tag", tag);
      data.put("score", score);
      data.put("userid", usrId);
      data.put("sessions", sessions);
      // use the storage handler to add the document to the database
      this.storageHandler.addDocument(usrId, "tag", usrId, data);

      responseMap.put("response_type", "success");
      responseMap.put("tag", tag);
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
