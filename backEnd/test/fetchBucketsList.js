let headersList = {
  "Content-Type": "application/json",
};

let bodyContent = JSON.stringify({
  token:
    "BPAEnkCiH3HJ29N9if6QoH2sHj6S3iKltyJ7UCtuc-oIuUHRpS4O2VehBDVrlm59C5ViC2KgKkUPTFnTgTIHjA==",
  orgID: "feb7eb1c8b67e579",
});

let response = await fetch("http://localhost:4000/buckets", {
  method: "POST",
  body: bodyContent,
  headers: headersList,
});

let data = await response.json();
console.log(data);
