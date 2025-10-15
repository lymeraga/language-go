package edu.brown.cs.student.main.server.Handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetScoreHandler implements Route {

  public StorageInterface storageHandler;

  public GetScoreHandler(StorageInterface storageHandler) {
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
      String usrId = request.queryParams("userid");

      List<Map<String, Object>> score = this.storageHandler.getCollection(usrId, "score");

      responseMap.put("response_type", "success");

      responseMap.put("score", score);
      responseMap.put("userid", usrId);
    } catch (NumberFormatException e) {
      // error likely occurred in the storage handler
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    } catch (ExecutionException e) {
      throw new RuntimeException(e);
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
    return Utils.toMoshiJson(responseMap);
  }
}
