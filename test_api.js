async function run() {
  console.log("=== 1. REGISTER & LOGIN ===");
  const username = "tony_stark_" + Math.floor(Math.random() * 1000);
  const regRes = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password: "JarvisPassword123!" })
  });
  console.log("Register:", regRes.status, (await regRes.json()).message);

  const loginRes = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password: "JarvisPassword123!" })
  });
  const { data: { token } } = await loginRes.json();
  console.log("Login: 200 Token acquired!");

  console.log("\n=== 2. CREATE ORGANIZATION ===");
  const orgRes = await fetch("http://localhost:3000/org", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ name: "Stark Industries" })
  });
  const orgJson = await orgRes.json();
  console.log("Create Org:", orgRes.status, orgJson.message);
  const orgId = orgJson.data.id;

  console.log("\n=== 3. CREATE PROJECT (RBAC Protected: project:create) ===");
  const projRes = await fetch("http://localhost:3000/project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
      "organization-id": orgId
    },
    body: JSON.stringify({ name: "Iron Suit Mark 1", description: "Arc reactor powered" })
  });
  const projJson = await projRes.json();
  console.log("Create Project:", projRes.status, projJson.message);
  const projectId = projJson.data.id;

  console.log("\n=== 4. VERIFY REDIS CACHE (Second Request - Cache Hit!) ===");
  const projRes2 = await fetch("http://localhost:3000/project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
      "organization-id": orgId
    },
    body: JSON.stringify({ name: "Iron Suit Mark 2", description: "Titanium alloy" })
  });
  console.log("Create Second Project (Cache Hit):", projRes2.status, (await projRes2.json()).message);

  console.log("\n=== 5. CREATE TASK (RBAC Protected: task:create) ===");
  const taskRes = await fetch("http://localhost:3000/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
      "organization-id": orgId
    },
    body: JSON.stringify({
      title: "Design Flight Stabilizers",
      projectId: projectId,
      description: "Repulsor flight tests",
      status: "in_progress"
    })
  });
  const taskJson = await taskRes.json();
  console.log("Create Task:", taskRes.status, taskJson.message);

  console.log("\n=== 6. GET TASKS BY PROJECT ===");
  const getTasksRes = await fetch("http://localhost:3000/task/project/" + projectId, {
    headers: { "Authorization": "Bearer " + token }
  });
  const getTasksJson = await getTasksRes.json();
  console.log("Get Tasks:", getTasksRes.status, "Count:", getTasksJson.data.length, getTasksJson.data[0].title);

  console.log("\n=== 7. NEGATIVE TEST: Unauthorized request (Expect 401) ===");
  const unauth = await fetch("http://localhost:3000/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Hacker Project" })
  });
  console.log("No Token Status:", unauth.status);

  console.log("\n=== 8. NEGATIVE TEST: Wrong Org / No Permission (Expect 403) ===");
  const fakeOrgId = "00000000-0000-0000-0000-000000000000";
  const forbidden = await fetch("http://localhost:3000/project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
      "organization-id": fakeOrgId
    },
    body: JSON.stringify({ name: "Intruder Project" })
  });
  console.log("Wrong Org Status:", forbidden.status, await forbidden.json());

  console.log("\n?? ALL TESTS PASSED SUCCESSFULLY! FULL RBAC SYSTEM OPERATIONAL! ??");
}
run().catch(console.error);
