// ===============================
// FASTAPI CONNECTION TEST
// ===============================

fetch("http://127.0.0.1:8000/")
    .then(response => response.json())
    .then(data => {
        console.log("FastAPI connected:", data);
    })
    .catch(error => {
        console.error("FastAPI connection failed:", error);
    });