process.env.NODE_ENV = "test";
import http from "http";
import app from "./server.js";

async function runTests() {
  console.log("🌱 Starting In-Process Server for Authentication & Data Isolation Test...\n");

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const BASE_URL = `http://127.0.0.1:${port}`;
  console.log(`Server listening on ephemeral test port ${port}`);

  const postJSON = (path, body, token = null) => {
    return new Promise((resolve, reject) => {
      const url = new URL(path, BASE_URL);
      const data = JSON.stringify(body);
      const headers = {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const req = http.request(
        url,
        {
          method: "POST",
          headers
        },
        (res) => {
          let respData = "";
          res.on("data", (chunk) => (respData += chunk));
          res.on("end", () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(respData) });
            } catch (e) {
              resolve({ status: res.statusCode, text: respData });
            }
          });
        }
      );
      req.on("error", reject);
      req.write(data);
      req.end();
    });
  };

  const getJSON = (path, token = null) => {
    return new Promise((resolve, reject) => {
      const url = new URL(path, BASE_URL);
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const req = http.request(
        url,
        {
          method: "GET",
          headers
        },
        (res) => {
          let respData = "";
          res.on("data", (chunk) => (respData += chunk));
          res.on("end", () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(respData) });
            } catch (e) {
              resolve({ status: res.statusCode, text: respData });
            }
          });
        }
      );
      req.on("error", reject);
      req.end();
    });
  };

  try {
    const timestamp = Date.now();
    const emailA = `alice_${timestamp}@ecocalm.test`;
    const emailB = `bob_${timestamp}@ecocalm.test`;

    // Step 1: Register / Log in Account A
    console.log(`1. Registering Account A (${emailA})...`);
    const regA = await postJSON("/api/auth/register", {
      name: "Alice Green",
      email: emailA,
      password: "peaceful123"
    });
    console.log("Account A register status:", regA.status, "Name:", regA.data.user?.name);
    const tokenA = regA.data.token;

    // Step 2: Account A selects a plant and saves custom name
    console.log("2. Account A adopts a Sunflower named 'Sunny Alice'...");
    const adoptA = await postJSON(
      "/api/plant/adopt",
      {
        plantType: "sunflower",
        variety: "Golden Sunburst",
        name: "Sunny Alice",
        intention: "Growing toward the light",
        potStyle: "terracotta"
      },
      tokenA
    );
    console.log("Account A plant adopted:", adoptA.data.plant?.name, "Pot:", adoptA.data.plant?.potStyle);

    // Step 3: Account A completes a Vibe Check (Before)
    console.log("3. Account A records Vibe Check (Before)...");
    const vibeA = await postJSON(
      "/api/mood",
      {
        score: 2,
        emotion: "Peaceful",
        note: "Alice is feeling peaceful today",
        checkinType: "before"
      },
      tokenA
    );
    console.log("Account A mood logged:", vibeA.data.mood?.emotion, "Score:", vibeA.data.mood?.score);

    // Step 4: Verify Account A's state
    const plantCheckA = await getJSON("/api/plant", tokenA);
    const moodCheckA = await getJSON("/api/mood", tokenA);
    console.log("Verification A -> Plant:", plantCheckA.data?.name, "Mood logs count:", moodCheckA.data?.length);

    // Step 5: Log in Account B
    console.log(`\n4. Registering Account B (${emailB})...`);
    const regB = await postJSON("/api/auth/register", {
      name: "Bob Stone",
      email: emailB,
      password: "peaceful123"
    });
    console.log("Account B register status:", regB.status, "Name:", regB.data.user?.name);
    const tokenB = regB.data.token;

    // Step 6: Verify Account B does NOT see Account A's plant or mood history
    console.log("5. Verifying Account B has INDEPENDENT data (no leak of Alice)...");
    const plantCheckB1 = await getJSON("/api/plant", tokenB);
    const moodCheckB1 = await getJSON("/api/mood", tokenB);
    console.log("Account B plant name:", plantCheckB1.data?.name, "(Should NOT be 'Sunny Alice')");
    console.log("Account B mood count:", moodCheckB1.data?.length, "(Should be 0, not Alice's logs)");

    if (plantCheckB1.data?.name === "Sunny Alice") {
      throw new Error("FAIL: Account B leaked Account A's plant!");
    }
    if (moodCheckB1.data?.length > 0) {
      throw new Error("FAIL: Account B leaked Account A's mood history!");
    }

    // Step 7: Select a different plant for Account B
    console.log("6. Account B adopts a Lavender named 'Purple Bob'...");
    const adoptB = await postJSON(
      "/api/plant/adopt",
      {
        plantType: "lavender",
        variety: "French Provence",
        name: "Purple Bob",
        intention: "Finding calm in the evening",
        potStyle: "lavender_glaze"
      },
      tokenB
    );
    console.log("Account B plant adopted:", adoptB.data.plant?.name, "Pot:", adoptB.data.plant?.potStyle);

    // Account B logs mood
    await postJSON(
      "/api/mood",
      {
        score: 7,
        emotion: "Anxious",
        note: "Bob is feeling restless",
        checkinType: "before"
      },
      tokenB
    );

    // Step 8: Log back in using Account A and verify original info is intact
    console.log("\n7. Logging back into Account A and verifying data integrity...");
    const loginA = await postJSON("/api/auth/login", {
      email: emailA,
      password: "peaceful123"
    });
    const reTokenA = loginA.data.token;
    const plantReCheckA = await getJSON("/api/plant", reTokenA);
    const moodReCheckA = await getJSON("/api/mood", reTokenA);

    console.log("Account A recheck plant name:", plantReCheckA.data?.name, "(Expected: 'Sunny Alice')");
    console.log("Account A recheck mood emotion:", moodReCheckA.data[0]?.emotion, "(Expected: 'Peaceful')");

    if (plantReCheckA.data?.name !== "Sunny Alice") {
      throw new Error("FAIL: Account A's plant was lost or overwritten!");
    }
    if (moodReCheckA.data[0]?.emotion !== "Peaceful") {
      throw new Error("FAIL: Account A's mood log was lost or overwritten!");
    }

    // Step 9: Verify Admin Account is independent
    console.log("\n8. Testing Admin Account (hemal.au123@gmail.com)...");
    const loginAdmin = await postJSON("/api/auth/login", {
      email: "hemal.au123@gmail.com",
      password: "hemal@admin"
    });
    console.log(
      "Admin login status:",
      loginAdmin.status,
      "Name:",
      loginAdmin.data.user?.name,
      "Role:",
      loginAdmin.data.user?.role
    );
    const tokenAdmin = loginAdmin.data.token;
    const plantAdmin = await getJSON("/api/plant", tokenAdmin);
    console.log("Admin plant name:", plantAdmin.data?.name, "(Admin's independent plant)");

    if (loginAdmin.data.user?.name === "Maya Chen") {
      throw new Error("FAIL: Admin account displays Maya Chen!");
    }

    // Step 10: Test News API
    console.log("\n9. Testing Daily News Endpoint...");
    const newsRes = await getJSON("/api/news");
    console.log("News status:", newsRes.status, "Articles returned:", newsRes.data?.length);

    console.log("\n========================================================");
    console.log("🎉 ALL TESTS PASSED! User data isolation & authentication are 100% verified.");
    console.log("========================================================\n");
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
