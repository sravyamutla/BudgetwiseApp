

async function test() {
    const payload = {
        userId: 1, // I need to get a valid user ID, I'll pass 1. If 1 doesn't exist, I'll see "User not found".
        description: 'Test',
        amount: 50.0,
        date: '2023-10-25',
        category: 'Food',
        type: 'expense'
    };

    console.log("Sending:", payload);

    try {
        const res = await fetch('http://localhost:8080/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response:", text);
    } catch (e) {
        console.error(e);
    }
}

test();
