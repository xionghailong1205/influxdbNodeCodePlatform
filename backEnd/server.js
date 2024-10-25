import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { InfluxDB } from "@influxdata/influxdb-client";
import { BucketsAPI } from "@influxdata/influxdb-client-apis";
import { config } from "./config/apiConfig.js";
// 添加一个 express-session

// 我们要参考的 API 手册:
// https://docs.influxdata.com/flux/v0/stdlib/influxdata/influxdb/schema/measurements/#return-a-list-of-measurements-in-an-influxdb-bucket

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { url } = config.dataSource.influxDB;
const { visualizationDashboardUid, token: grafanaAPIToken } =
  config.visuallization.grafana;

const getBuckList = async (token, orgID) => {
  try {
    const influxDB = new InfluxDB({ url, token });
    const bucketsAPI = new BucketsAPI(influxDB);

    // Fetch buckets using the provided organization ID
    await bucketsAPI.getBuckets({ orgID });
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, token, orgId } = req.body;

  // Connect to InfluxDB with the provided token
  const result = getBuckList(token, orgId);

  if (result) {
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({
      message: "Login failed. Please check API token and organization ID.",
    });
  }
});

// Fetch buckets list using the user's token and orgId
app.post("/buckets", async (req, res) => {
  const { token, orgID } = req.body;

  if (!token || !orgID) {
    return res
      .status(401)
      .json({ message: "User session not found or Organization ID missing" });
  }

  try {
    const influxDB = new InfluxDB({ url, token });
    const bucketsAPI = new BucketsAPI(influxDB);

    // Fetch buckets using the provided organization ID
    const response = await bucketsAPI.getBuckets({ orgID });

    console.log("Buckets API response:", response);

    const userBuckets = response.buckets
      .filter((bucketInfo) => {
        return bucketInfo.type === "user";
      })
      .map((bucket) => ({
        id: bucket.id,
        name: bucket.name,
      }));

    res.json({ data: userBuckets });
  } catch (error) {
    console.error("Error when fetching buckets:", error);

    res
      .status(500)
      .json({ message: "Failed to fetch buckets", error: error.message });
  }
});

// Fetch measurement list using orgId
app.post("/measurements", async (req, res) => {
  const { token, orgID, bucketName } = req.body;

  const influxDB = new InfluxDB({ url, token });

  if (influxDB) {
    const queryAPI = influxDB.getQueryApi(orgID);

    const fluxQuery = `
    import "influxdata/influxdb/schema"

    schema.measurements(bucket: "${bucketName}")
  `;

    console.log("Executing measurements query:", fluxQuery);

    const measurementList = [];

    queryAPI.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);
        measurementList.push({
          name: tableObject._value,
        });
      },
      error: (error) => {
        res.status(500).json({
          message: "Failed to fetch measurements",
          error: error.message,
        });
      },
      complete: () => {
        res.json({ data: measurementList });
      },
    });
  } else {
    res
      .status(401)
      .json({ message: "User session not found or Organization ID missing" });
  }
});

// Fetch filed key list
// https://docs.influxdata.com/influxdb/v2/query-data/flux/explore-schema/#list-fields-in-a-measurement
app.post("/fields", async (req, res) => {
  const { token, orgID, bucketName, measurementName } = req.body;

  const influxDB = new InfluxDB({ url, token });

  if (influxDB) {
    const queryAPI = influxDB.getQueryApi(orgID);

    const fluxQuery = `
    import "influxdata/influxdb/schema"

    schema.measurementFieldKeys(
      bucket: "${bucketName}",
      measurement: "${measurementName}",
    )
  `;

    console.log("Executing fields query:", fluxQuery);

    const fieldList = [];

    queryAPI.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);

        console.log(tableObject);

        fieldList.push({
          name: tableObject._value,
        });
      },
      error: (error) => {
        res.status(500).json({
          message: "Failed to fetch measurements",
          error: error.message,
        });
      },
      complete: () => {
        res.json({ data: fieldList });
      },
    });
  } else {
    res
      .status(401)
      .json({ message: "User session not found or Organization ID missing" });
  }
});

// Fetch tag key list
// https://docs.influxdata.com/influxdb/v2/query-data/flux/explore-schema/#list-tag-keys-in-a-measurement
app.post("/tagkeys", async (req, res) => {
  const { token, orgID, bucketName, measurementName } = req.body;

  const influxDB = new InfluxDB({ url, token });

  if (influxDB) {
    const queryAPI = influxDB.getQueryApi(orgID);

    const fluxQuery = `
    import "influxdata/influxdb/schema"

    schema.measurementTagKeys(
      bucket: "${bucketName}",
      measurement: "${measurementName}",
    )
  `;

    console.log("Executing tagkeys query:", fluxQuery);

    const tagKeyList = [];

    queryAPI.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);

        console.log(tableObject);

        // filter build-in tag
        const tagKey = tableObject._value;
        if (tagKey.startsWith("_")) {
          // do nothing
        } else {
          tagKeyList.push({
            name: tagKey,
          });
        }
      },
      error: (error) => {
        res.status(500).json({
          message: "Failed to fetch measurements",
          error: error.message,
        });
      },
      complete: () => {
        res.json({ data: tagKeyList });
      },
    });
  } else {
    res
      .status(401)
      .json({ message: "User session not found or Organization ID missing" });
  }
});

// Fetch tag value list
// https://docs.influxdata.com/influxdb/v2/query-data/flux/explore-schema/#list-tag-values-in-a-measurement
app.post("/tagValues", async (req, res) => {
  const { token, orgID, bucketName, measurementName, tagName } = req.body;

  const influxDB = new InfluxDB({ url, token });

  if (influxDB) {
    const queryAPI = influxDB.getQueryApi(orgID);

    const fluxQuery = `
    import "influxdata/influxdb/schema"

    schema.measurementTagValues(
      bucket: "${bucketName}",
      tag: "${tagName}",
      measurement: "${measurementName}",
    )
  `;

    console.log("Executing tag value query:", fluxQuery);

    const tagValueList = [];

    queryAPI.queryRows(fluxQuery, {
      next: (row, tableMeta) => {
        const tableObject = tableMeta.toObject(row);
        tagValueList.push({
          name: tableObject._value,
        });
      },
      error: (error) => {
        res.status(500).json({
          message: "Failed to fetch measurements",
          error: error.message,
        });
      },
      complete: () => {
        res.json({ data: tagValueList });
      },
    });
  } else {
    res
      .status(401)
      .json({ message: "User session not found or Organization ID missing" });
  }
});

// Visualize search results
app.post("/doQuery", async (req, res) => {
  const { influxQueryCode } = req.body;

  changeFluxQueryCodeOfPanel(influxQueryCode).then((result) => {
    if (result?.status === "success") {
      res.json({ message: "Change Success" });
    } else {
      res.status(500).json({
        message: "Failed to query.",
        error: error.message,
      });
    }
  });
});

const getVisualizationDashBoardInfo = async () => {
  let headersList = {
    Accept: "*/*",
  };

  let response = await fetch(
    `http://localhost:3000/api/dashboards/uid/${visualizationDashboardUid}`,
    {
      method: "GET",
      headers: headersList,
    }
  );

  let dashBoardInfo = await response.json();
  return dashBoardInfo;
};

const changeFluxQueryCodeOfPanel = async (newQueryCode) => {
  const dashBoardInfo = await getVisualizationDashBoardInfo();

  //   const queryCode = dashBoardInfo.dashboard.panels[0].targets[0].query;
  dashBoardInfo.dashboard.panels[0].targets[0].query = newQueryCode;

  // 执行更新操作
  let headersList = {
    Accept: "application/json",
    Authorization: `Bearer ${grafanaAPIToken}`,
    "Content-Type": "application/json",
  };

  let response = await fetch("http://localhost:3000/api/dashboards/db", {
    method: "POST",
    body: JSON.stringify(dashBoardInfo),
    headers: headersList,
  });

  let result = await response.json();
  return result;
};

// Start the server
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
