// testing script from frontend
fetch("http://localhost:8081/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "frontend_testuser", email: "front@test.com", password: "password" })
}).then(async r => {
    console.log("Status:", r.status);
    console.log("Body:", await r.text());
}).catch(e => console.error("Error:", e.message));
