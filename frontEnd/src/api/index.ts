import {
  BucketInfo,
  MeasurementInfo,
  FieldInfo,
  TagKeyInfo,
  TagValueInfo,
} from "@/state/useDnDSidebar";

interface AuthInfo {
  token: string;
  orgID: string;
}

export namespace API {
  const getAuthInfo = (): AuthInfo => {
    const token = localStorage.getItem("token")!;
    const orgID = localStorage.getItem("orgId")!;

    return {
      token,
      orgID,
    };
  };

  export const fetchBucketList = async (): Promise<BucketInfo[]> => {
    const { token, orgID } = getAuthInfo();

    try {
      let bodyContent = JSON.stringify({
        token,
        orgID,
      });

      let headersList = {
        "Content-Type": "application/json",
      };

      let response = await fetch("http://localhost:4000/buckets", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      return result.data as Array<BucketInfo>;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  export const fetchMeasurementList = async (
    bucketName: string
  ): Promise<MeasurementInfo[]> => {
    const { token, orgID } = getAuthInfo();

    try {
      let bodyContent = JSON.stringify({
        token,
        bucketName,
        orgID,
      });

      let headersList = {
        "Content-Type": "application/json",
      };

      let response = await fetch("http://localhost:4000/measurements", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      return result.data as Array<MeasurementInfo>;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  export const fetchFieldList = async ({
    bucketName,
    measurementName,
  }: {
    bucketName: string;
    measurementName: string;
  }): Promise<FieldInfo[]> => {
    const { token, orgID } = getAuthInfo();

    try {
      let bodyContent = JSON.stringify({
        token,
        orgID,
        bucketName,
        measurementName,
      });

      let headersList = {
        "Content-Type": "application/json",
      };

      let response = await fetch("http://localhost:4000/fields", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      return result.data as Array<FieldInfo>;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  export const fetchTagKeyList = async ({
    bucketName,
    measurementName,
  }: {
    bucketName: string;
    measurementName: string;
  }): Promise<TagKeyInfo[]> => {
    const { token, orgID } = getAuthInfo();

    try {
      let bodyContent = JSON.stringify({
        token,
        orgID,
        bucketName,
        measurementName,
      });

      let headersList = {
        "Content-Type": "application/json",
      };

      let response = await fetch("http://localhost:4000/tagkeys", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      return result.data as Array<TagKeyInfo>;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  export const fetchTagValueList = async ({
    bucketName,
    measurementName,
    tagName,
  }: {
    bucketName: string;
    measurementName: string;
    tagName: string;
  }) => {
    const { token, orgID } = getAuthInfo();

    try {
      let bodyContent = JSON.stringify({
        token,
        orgID,
        bucketName,
        measurementName,
        tagName,
      });

      let headersList = {
        "Content-Type": "application/json",
      };

      let response = await fetch("http://localhost:4000/tagValues", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      return result.data as Array<TagValueInfo>;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  export const doQuery = async ({ newFluxCode }: { newFluxCode: string }) => {
    let headersList = {
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      influxQueryCode: newFluxCode,
    });

    let response = await fetch("http://localhost:4000/doQuery", {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    let res = await response.json();
    return res;
  };

  export const getFluxQueryResult = async ({
    newFluxCode,
  }: {
    newFluxCode: string;
  }): Promise<Array<{}>> => {
    const { token, orgID } = getAuthInfo();

    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({
      influxQueryCode: newFluxCode,
      token,
      orgID,
    });

    let response = await fetch("http://localhost:4000/getfluxQueryResult", {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    let queryResult = await response.json();

    console.log(queryResult);

    return queryResult;
  };
}
