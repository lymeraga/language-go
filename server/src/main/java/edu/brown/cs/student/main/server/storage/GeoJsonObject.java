package edu.brown.cs.student.main.server.storage;

import java.util.List;
import java.util.Map;

/** Represents a GeoJSON object containing features. */
public class GeoJsonObject {
  public String type;
  public List<Feature> features;

  public static class Feature {
    public String type;
    public Geometry geometry;
    public Properties properties;
  }

  public static class Geometry {
    public String type;
    public Object coordinates;
  }

  public static class Properties {
    public String city;
    public String holc_grade;
    public Map<String, String> area_description_data;
  }
}
