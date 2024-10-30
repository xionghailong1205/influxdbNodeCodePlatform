import { config } from "../config/apiConfig.js";
import { InfluxDB } from "@influxdata/influxdb-client";

const { url, token, orgID } = config.dataSource.influxDB;

async function main() {
  const influxDB = new InfluxDB({ url, token });
  const queryAPI = influxDB.getQueryApi(orgID);

  // Flux query to fetch measurements
  const fluxQuery = `
    from(bucket: "test")
      |> range(start: 2024-10-01T00:00:00Z, stop: 2024-10-10T00:00:00Z)
      |> filter(fn: (r) => r._measurement == "coindesk")
      |> filter(fn: (r) => r.code == "GBP")
  `;

  console.log("Executing measurements query:", fluxQuery);

  queryAPI.queryRows(fluxQuery, {
    next: (row, tableMeta) => {
      const tableObject = tableMeta.toObject(row);
      console.log(tableObject);
    },
    error: (error) => {
      console.error("\nError", error);
    },
    complete: () => {
      console.log("\nSuccess");
    },
  });
}

main();
