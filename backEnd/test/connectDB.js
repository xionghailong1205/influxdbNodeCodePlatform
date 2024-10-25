import { InfluxDB } from "@influxdata/influxdb-client";
import { BucketsAPI } from "@influxdata/influxdb-client-apis";
import { config } from "../config/influxdb_config.js";

const { url, orgID, token } = config.dataSource.cloud;

export const influxDB = new InfluxDB({
  url,
  token,
});

const queryAPI = influxDB.getQueryApi(orgID);

const fluxQuery =
  'from(bucket:"test") |> range(start: -6d) |> filter(fn: (r) => r._measurement == "airSensors" and r.sensor_id == "TLM0203" )';

const rawResult = await queryAPI.queryRaw(fluxQuery);

console.log(rawResult);

// const bucketsAPI = new BucketsAPI(influxDB);

// // 我们尝试获取我们自己的一个 bucket
// bucketsAPI.getBuckets({ orgID: orgID }).then((result) => {
//   console.log(result);
// });
