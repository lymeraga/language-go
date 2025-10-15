package edu.brown.cs.student.main.server.storage;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.*;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class FirebaseUtilities implements StorageInterface {

  public FirebaseUtilities() throws IOException {
    String workingDirectory = System.getProperty("user.dir");
    Path firebaseConfigPath =
        Paths.get(workingDirectory, "src", "main", "resources", "firebase_config.json");

    FileInputStream serviceAccount = new FileInputStream(firebaseConfigPath.toString());

    FirebaseOptions options =
        new FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .build();

    FirebaseApp.initializeApp(options);
  }

  @Override
  public List<Map<String, Object>> getCollection(String uid, String collection_id)
      throws InterruptedException, ExecutionException, IllegalArgumentException {
    if (uid == null || collection_id == null) {
      throw new IllegalArgumentException("getCollection: uid and/or collection_id cannot be null");
    }

    Firestore db = FirestoreClient.getFirestore();
    List<Map<String, Object>> users = new ArrayList<>();
    if (uid.equals("all")) {
      for (CollectionReference collection : db.listCollections()) {
        // collection.getId();
        HashMap<String, Object> map = new HashMap<>();
        map.put("userid", collection.getId());
        users.add(map);
      }
      return users;
    }

    CollectionReference dataRef;
    dataRef = db.collection(uid);
    // Fetch only 50 documents at a time (pagination can be added later)
    Query query = dataRef.limit(50);
    QuerySnapshot dataQuery = query.get().get();
    List<Map<String, Object>> data = new ArrayList<>();
    for (QueryDocumentSnapshot doc : dataQuery.getDocuments()) {
      data.add(doc.getData());
    }
    return data;
  }

  @Override
  public void addDocument(String uid, String collection_id, String doc_id, Map<String, Object> data)
      throws IllegalArgumentException {
    if (uid == null || collection_id == null || doc_id == null || data == null) {
      throw new IllegalArgumentException(
          "addDocument: uid, collection_id, doc_id, or data cannot be null");
    }

    Firestore db = FirestoreClient.getFirestore();
    WriteBatch batch = db.batch(); // Start batching

    DocumentReference docRef = db.collection(uid).document(doc_id);
    batch.set(docRef, data);
    try {
      batch.commit().get(); // Commit the batched writes
    } catch (InterruptedException | ExecutionException e) {
      System.err.println("Error committing batch: " + e.getMessage());
    }
  }

  @Override
  public void clearUser(String uid) throws IllegalArgumentException {
    if (uid == null) {
      throw new IllegalArgumentException("clearUser: uid cannot be null");
    }

    try {
      Firestore db = FirestoreClient.getFirestore();

      if (uid.equals("shared")) {
        CollectionReference pinsRef = db.collection("pins");
        deleteCollection(pinsRef);
        return;
      }

      DocumentReference userDoc = db.collection("users").document(uid);
      deleteDocument(userDoc);

    } catch (Exception e) {
      System.err.println("Error removing user: " + uid);
      e.printStackTrace();
    }
  }

  @Override
  public void deleteDocument(String collection, String subcollection, String docId) {
    if (collection == null || docId == null) {
      throw new IllegalArgumentException("deleteDocument: collection and docId cannot be null");
    }

    try {
      Firestore db = FirestoreClient.getFirestore();

      if (subcollection == null || subcollection.isEmpty()) {
        // Delete document directly from the collection
        db.collection(collection).document(docId).delete();
      } else {
        // Delete document within a subcollection
        db.collection(collection)
            .document(docId)
            .collection(subcollection)
            .document(docId)
            .delete();
      }
    } catch (Exception e) {
      System.err.println("Error deleting document: " + e.getMessage());
    }
  }

  public void clearUserPins(String uid) throws InterruptedException, ExecutionException {
    if (uid == null) {
      throw new IllegalArgumentException("clearUserPins: uid cannot be null");
    }
    Firestore db = FirestoreClient.getFirestore();
    CollectionReference pinsRef = db.collection("pins");

    Query query = pinsRef.whereEqualTo("userId", uid).limit(50); // Clear only 50 at a time
    QuerySnapshot querySnapshot = query.get().get();

    if (!querySnapshot.isEmpty()) {
      WriteBatch batch = db.batch();
      for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
        batch.delete(document.getReference());
      }
      batch.commit().get();
    }
  }

  @Override
  public List<Map<String, Object>> getRedliningData(
      double minLat, double maxLat, double minLng, double maxLng) {
    Firestore db = FirestoreClient.getFirestore();
    CollectionReference redliningCollection = db.collection("redliningData");

    Query query =
        redliningCollection
            .whereGreaterThanOrEqualTo("latitude", minLat)
            .whereLessThanOrEqualTo("latitude", maxLat)
            .whereGreaterThanOrEqualTo("longitude", minLng)
            .whereLessThanOrEqualTo("longitude", maxLng);

    List<Map<String, Object>> results = new ArrayList<>();
    try {
      QuerySnapshot snapshot = query.get().get();
      snapshot.getDocuments().forEach(doc -> results.add(doc.getData()));
    } catch (InterruptedException | ExecutionException e) {
      System.err.println("Error fetching redlining data: " + e.getMessage());
    }

    return results;
  }

  public void deleteWhereEqual(String collection, String field, String value)
      throws InterruptedException, ExecutionException {
    Firestore db = FirestoreClient.getFirestore();

    CollectionReference colRef = db.collection(collection);
    QuerySnapshot querySnapshot = colRef.whereEqualTo(field, value).get().get();

    for (QueryDocumentSnapshot document : querySnapshot.getDocuments()) {
      document.getReference().delete();
    }
  }

  public void deleteDocument(DocumentReference docRef) {
    docRef.delete();
  }

  private void deleteCollection(CollectionReference collection) {
    try {
      ApiFuture<QuerySnapshot> future = collection.get();
      List<QueryDocumentSnapshot> documents = future.get().getDocuments();

      for (QueryDocumentSnapshot doc : documents) {
        doc.getReference().delete();
      }
    } catch (Exception e) {
      System.err.println("Error deleting collection: " + e.getMessage());
    }
  }
}
