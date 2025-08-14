// Test direct de votre API Symfony pour déboguer le login
// Exécutez avec: node test-api-direct.js

async function testLogin() {
  const API_URL = "http://127.0.0.1:8000/api/login";

  const loginData = {
    email: "khe.walid59@gmail.com",
    password: "walid2002",
  };

  console.log("🔍 Test direct de l'API Symfony...");
  console.log("URL:", API_URL);
  console.log("Données envoyées:", loginData);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(loginData),
    });

    console.log("\n📡 Réponse HTTP:");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log("\n📄 Contenu de la réponse:");
    console.log(responseText);

    if (response.headers.get("content-type")?.includes("application/json")) {
      try {
        const jsonData = JSON.parse(responseText);
        console.log("\n🎯 Données JSON parsées:");
        console.log(JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log("❌ Impossible de parser le JSON");
      }
    }
  } catch (error) {
    console.error("\n❌ Erreur lors de la requête:");
    console.error(error.message);
    console.error("Type d'erreur:", error.constructor.name);
  }
}

testLogin();
