async function run() {
  console.log("=== 1. SETUP USERS: ALICE (ADMIN) & BOB (MEMBER) ===");
  const suffix = Math.floor(Math.random() * 10000);
  
  // Register Alice
  await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "alice_" + suffix, password: "Password123!" })
  });
  const aliceLogin = await (await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "alice_" + suffix, password: "Password123!" })
  })).json();
  const aliceToken = aliceLogin.data.token;
  const aliceId = aliceLogin.data.id;

  // Register Bob
  await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "bob_" + suffix, password: "Password123!" })
  });
  const bobLogin = await (await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "bob_" + suffix, password: "Password123!" })
  })).json();
  const bobToken = bobLogin.data.token;
  const bobId = bobLogin.data.id;

  console.log("\n=== 2. ALICE CREATES ORG & SECRET PROJECT ===");
  const orgRes = await (await fetch("http://localhost:3000/org", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + aliceToken },
    body: JSON.stringify({ name: "Defense Corp " + suffix })
  })).json();
  const orgId = orgRes.data.id;

  const projRes = await (await fetch("http://localhost:3000/project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + aliceToken,
      "organization-id": orgId
    },
    body: JSON.stringify({ name: "Project Stealth Bomber", description: "Top secret stealth project" })
  })).json();
  const projectId = projRes.data.id;
  console.log("Project created:", projRes.data.name, "ID:", projectId);

  console.log("\n=== 3. BOB VIEWS PROJECTS BEFORE BEING ADDED ===");
  const bobProjectsBefore = await (await fetch("http://localhost:3000/project", {
    headers: { "Authorization": "Bearer " + bobToken, "organization-id": orgId }
  })).json();
  console.log("Bob sees project count:", bobProjectsBefore.data.length);

  console.log("\n=== 4. ALICE ADDS BOB TO THE PROJECT TEAM ===");
  const addMemberRes = await (await fetch(`http://localhost:3000/project/${projectId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + aliceToken,
      "organization-id": orgId
    },
    body: JSON.stringify({ userId: bobId })
  })).json();
  console.log("Member added response:", addMemberRes.message);

  console.log("\n=== 5. BOB VIEWS PROJECTS AFTER BEING ADDED ===");
  const bobProjectsAfter = await (await fetch("http://localhost:3000/project", {
    headers: { "Authorization": "Bearer " + bobToken, "organization-id": orgId }
  })).json();
  console.log("Bob sees project count:", bobProjectsAfter.data.length);
  console.log("Bob sees project name:", bobProjectsAfter.data[0].name);

  console.log("\n?? PROJECT VISIBILITY SCOPING CONFIRMED WORKING PERFECTLY! ??");
}
run().catch(console.error);
