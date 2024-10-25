import { API } from "@/api";
import { create } from "zustand";
import { MeasurementInfo, BucketInfo, FieldInfo, TagKeyInfo } from "./type";
import { DnDState } from "../type";

type State = {
  sideBarState: DnDState;
  bucketList: Array<BucketInfo>;
  measurementList: Array<MeasurementInfo>;
  fieldList: Array<FieldInfo>;
  tagKeyList: Array<TagKeyInfo>;
  // tagValueList: Array<TagValueInfo>;
};

type Action = {
  changeSideBarState: (newState: DnDState) => void;
  fetchBucketList: () => void;
  fetchMeasurementList: (bucketName: string) => void;
  fetchFieldList: (bucketName: string, measurementName: string) => void;
  fetchTagKeyList: (bucketName: string, measurementName: string) => void;
};

export const useDnDSidebar = create<State & Action>((set) => ({
  sideBarState: "chooseBucket",
  bucketList: [],
  measurementList: [],
  fieldList: [],
  tagKeyList: [],
  tagValueList: [],
  fetchBucketList() {
    API.fetchBucketList().then((bucketList) => {
      set({
        bucketList,
      });
    });
  },
  fetchMeasurementList(bucketName) {
    API.fetchMeasurementList(bucketName).then((measurementList) => {
      set({
        measurementList,
      });
    });
  },
  fetchFieldList(bucketName, measurementName) {
    API.fetchFieldList({
      bucketName,
      measurementName,
    }).then((fieldList) => {
      set({
        fieldList,
      });
    });
  },
  fetchTagKeyList(bucketName, measurementName) {
    API.fetchTagKeyList({
      bucketName,
      measurementName,
    }).then((tagKeyList) => {
      set({
        tagKeyList,
      });
    });
  },
  // fetchTagValueList(bucketName, measurementName, tagName) {
  //   API.fetchTagValueList({
  //     bucketName,
  //     measurementName,
  //     tagName,
  //   }).then((tagValueList) => {
  //     set({
  //       tagValueList,
  //     });
  //   });
  // },
  changeSideBarState: (newState) => {
    set({
      sideBarState: newState,
    });
  },
}));
