// testing transaction creation
async function test() {
    // 1. Signup a user to get a valid ID (or we just use userId: 1 and see if it works, maybe signup "testuser2" just in case)
    let res = await fetch("http://localhost:8081/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "trans_user", email: "trans@test.com", password: "password" })
    });

    // login to get id
    res = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "trans@test.com", password: "password" })
    });
    let userId = await res.text();
    console.log("Logged in user ID:", userId);

    // 2. Create transaction
    const payload = {
        userId: parseInt(userId),
        description: "Test Description",
        amount: 50.0,
        date: "2026-02-26",
        category: "Food",
        type: "expense"
    };

    let txRes = await fetch("http://localhost:8081/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    console.log("Tx Status:", txRes.status);
    console.log("Tx Body:", await txRes.text());
}

test().catch(console.error);
