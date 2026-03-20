require('dotenv').config();

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API Key starting with:", apiKey ? apiKey.substring(0, 5) : "MISSING");
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}
run();
