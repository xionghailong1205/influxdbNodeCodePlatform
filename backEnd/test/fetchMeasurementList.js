let headersList = {
  "Content-Type": "application/json",
};

let bodyContent = JSON.stringify({
  token:
    "BPAEnkCiH3HJ29N9if6QoH2sHj6S3iKltyJ7UCtuc-oIuUHRpS4O2VehBDVrlm59C5ViC2KgKkUPTFnTgTIHjA==",
  bucketName: "test",
});

let response = await fetch("http://localhost:4000/measurements", {
  method: "POST",
  body: bodyContent,
  headers: headersList,
});

let data = await response.text();
console.log(data);
