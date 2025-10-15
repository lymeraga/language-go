import { expect, test } from "@playwright/test";

test.beforeEach(() => {
});

test("testing getScore and storeScore", async () => {
  // Getting the user data 
  let result = await fetch(
    "http://localhost:3232/getScore?userid=111"
  );
  let response = await result.json();
  let sessions = response.score[0].sessions;

  await expect(response.score[0].score).toBe(120);
  await expect(response.score[0].tag).toBe(":)");
  

  //Updating the user score 
  await fetch(
    "http://localhost:3232/storeScore?userid=111&score=10"
  );
  //testing if the user data is accurate 
  result = await fetch(
    "http://localhost:3232/getScore?userid=111"
  );
  response = await result.json();

  await expect(response.score[0].score).toBe(130);
  await expect(response.score[0].tag).toBe(":)");
  await expect(response.score[0].sessions).toBe(sessions+1);

  //Resetting the user score
  await fetch(
    "http://localhost:3232/storeScore?userid=111&score=-10"
  );
});


test("Testing updateTag", async () => {
  //Getting the user tag and user data
  let result = await fetch(
    "http://localhost:3232/getScore?userid=111"
  );
  let response = await result.json();

  await expect(response.score[0].score).toBe(120);
  await expect(response.score[0].tag).toBe(":)");


  //Updating the user tag to the test value
  await fetch(
    "http://localhost:3232/updateTag?tag=test&userid=111"
  );

  //Testing if the user value is accurate
  result = await fetch(
    "http://localhost:3232/getScore?userid=111"
  );
  response = await result.json();

  await expect(response.score[0].score).toBe(120);
  await expect(response.score[0].tag).toBe("test");

  //Reseting the user tag
  await fetch(
    "http://localhost:3232/updateTag?tag=:)&userid=111"
  );
});
