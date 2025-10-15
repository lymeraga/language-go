package edu.brown.cs.student.main.server.storage;

import com.squareup.moshi.Moshi;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

/** Utility class to parse GeoJSON files. */
public class JSONParser {
  private GeoJsonObject parsedJSON;

  public GeoJsonObject getParsedJSON() {
    return parsedJSON;
  }

  public void loadGeoJsonData(String filePath) throws IOException {
    Moshi moshi = new Moshi.Builder().build();
    BufferedReader br = new BufferedReader(new FileReader(filePath));
    StringBuilder fileString = new StringBuilder();
    String line;
    while ((line = br.readLine()) != null) {
      fileString.append(line);
    }
    br.close();

    try {
      this.parsedJSON = moshi.adapter(GeoJsonObject.class).fromJson(fileString.toString());
      if (parsedJSON != null) {
        System.out.println(
            "Parsed GeoJSON successfully. Feature count: " + parsedJSON.features.size());
      } else {
        System.err.println("Failed to parse GeoJSON.");
      }
    } catch (Exception e) {
      System.err.println("Error parsing GeoJSON: " + e.getMessage());
      e.printStackTrace();
    }
  }
}
