const string = `
from(bucket: "test")
    |> range(start: 2024-10-01T00:00:00Z, stop: 2024-10-04T00:00:00Z)
    |> filter(fn: (r) => r._measurement == "coindesk")
    |> filter(fn: (r) => r.code == "EUR")
`;

console.log(JSON.stringify(string));
