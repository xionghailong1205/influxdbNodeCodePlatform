import { InfluxDB } from "@influxdata/influxdb-client";
import { config } from "../config/influxdb_config.js";

const { url, orgID, token } = config.dataSource.cloud;

export const influxDB = new InfluxDB({
  url,
  token,
});

const queryAPI = influxDB.getQueryApi(orgID);

const fluxQuery = "SHOW TAG KEYS";

const rawResult = await queryAPI.queryRaw(fluxQuery);

console.log(rawResult);
