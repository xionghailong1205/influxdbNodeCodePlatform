import { create } from "zustand";
import { DnDState } from "../type";
import { produce } from "immer";
import { TagInfo } from "@/View/DashBoard/type";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { useDnDSidebar } from "../useDnDSidebar";

export type BoxType = "BucketBox" | "MeasurementBox" | "FieldBox" | "TagBox";

type State = {
  selectedBucket: string | undefined;
  selectedMeasurement: string | undefined;
  // only one selectedField
  selectedField: string | undefined;
  // multiple Tag
  selectedTags: Array<TagInfo>;
  selectedDateRange: DateRange | undefined;
  fluxQueryCode: string | undefined;
};

type Action = {
  setSelectedBucket: (bucketName: string) => void;
  setSelectedMeasurement: (measurementName: string) => void;
  setSelectedField: (fieldName: string) => void;
  addSelectedTag: (tagInfo: TagInfo) => void;
  deleteSelectedBucket: () => void;
  deleteSelectedMeasurement: () => void;
  deleteSelectedField: () => void;
  deleteSelectedTag: (tagKyeToDelete: string) => void;
  setSelectedDateRange: (dateRange: DateRange | undefined) => void;
  setFluxQueryCode: (fluxQueryCode: string) => void;
};

const defaultTimeRange = {
  from: new Date(),
  to: addDays(new Date(), 20),
};

export const useCodeGenerator = create<State & Action>((set, get) => ({
  selectedBucket: undefined,
  selectedMeasurement: undefined,
  selectedField: undefined,
  selectedTags: [],
  selectedDateRange: defaultTimeRange,
  fluxQueryCode: undefined,
  setSelectedBucket: (bucketName) => {
    set({
      selectedBucket: bucketName,
    });
  },
  deleteSelectedBucket() {
    const changeSideBarState = useDnDSidebar.getState().changeSideBarState;

    set({
      selectedBucket: undefined,
      selectedMeasurement: undefined,
      selectedField: undefined,
      selectedTags: [],
    });

    changeSideBarState("chooseBucket");
  },
  setSelectedMeasurement(measurementName) {
    set({
      selectedMeasurement: measurementName,
    });
  },
  deleteSelectedMeasurement() {
    const changeSideBarState = useDnDSidebar.getState().changeSideBarState;

    set({
      selectedMeasurement: undefined,
      selectedField: undefined,
      selectedTags: [],
    });

    changeSideBarState("chooseMeasurement");
  },
  setSelectedField(fieldName) {
    set({
      selectedField: fieldName,
    });
  },
  deleteSelectedField() {
    set({
      selectedField: undefined,
    });
  },
  addSelectedTag(tagInfo) {
    // check repeat tag key
    const keyOfTagToAdd = Object.keys(tagInfo)[0];
    const selectedTagList = get().selectedTags;
    const selectedTagKeyList = selectedTagList.map((tagInfo) => {
      return Object.keys(tagInfo)[0];
    });

    const TagKeyHasSelected = selectedTagKeyList.find((tagKeyHasSelected) => {
      if (tagKeyHasSelected === keyOfTagToAdd) {
        return true;
      } else {
        return false;
      }
    });

    if (TagKeyHasSelected) {
      set(
        produce((state: State) => {
          state.selectedTags.forEach((tagInfoAlreadyExisted) => {
            const tagKey = Object.keys(tagInfoAlreadyExisted)[0];
            if (tagKey === keyOfTagToAdd) {
              tagInfoAlreadyExisted[keyOfTagToAdd] = tagInfo[keyOfTagToAdd];
            }
          });
        })
      );
    } else {
      set(
        produce((state: State) => {
          state.selectedTags.push(tagInfo);
        })
      );
    }
  },
  deleteSelectedTag(tagKyeToDelete) {
    set(
      produce((state: State) => {
        state.selectedTags = state.selectedTags.filter((tagInfo) => {
          const tagKey = Object.keys(tagInfo)[0];

          return tagKey !== tagKyeToDelete;
        });
      })
    );
  },
  setSelectedDateRange(dateRange) {
    set({
      selectedDateRange: dateRange,
    });
  },
  setFluxQueryCode(fluxQueryCode) {
    set({
      fluxQueryCode,
    });
  },
}));
