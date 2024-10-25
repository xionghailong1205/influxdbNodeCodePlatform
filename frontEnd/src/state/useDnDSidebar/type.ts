export interface BucketInfo {
  name: string;
}

export interface MeasurementInfo {
  name: string;
}

export interface FieldInfo {
  name: string;
}

export interface TagKeyInfo {
  name: string;
}

export interface TagValueInfo {
  name: string;
}

export enum BoxType {
  "BucketBox" = "bucketbox",
  "MeasurementBox" = "measurementbox",
  "FieldBox" = "fieldbox",
  "TagBox" = "tagbox",
}
