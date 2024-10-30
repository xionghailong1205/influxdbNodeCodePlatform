import { QueryResult } from "@/View/DashBoard/Content/InfluxDBResultTable";
import { create } from "zustand";

type State = {
  dataSource: QueryResult;
  currentPage: number;
  resultNumberOnePage: number;
  totalPage: number;
  headerList: Array<string>;
};

type Action = {
  changeTable: (newDataSource: QueryResult) => void;
  clearDataSource: () => void;
  goNextPage: () => void;
  goPreviousPage: () => void;
};

export const useInfluxdbResult = create<State & Action>((set, get) => ({
  dataSource: [],
  currentPage: 1,
  resultNumberOnePage: 5,
  totalPage: 0,
  headerList: [],
  changeTable(newDataSource) {
    if (newDataSource.length > 0) {
      const currentPage = 1;
      const resultNumberOnePage = get().resultNumberOnePage;
      const numberOfResult = newDataSource.length;
      const totalPage = Math.floor(numberOfResult / resultNumberOnePage) + 1;

      const firstRow = newDataSource[0];

      const headerList = Object.keys(firstRow);

      set({
        dataSource: newDataSource,
        currentPage,
        totalPage,
        headerList,
      });
    } else {
      // 我们之后处理
    }
  },
  goNextPage() {
    const currentPage = get().currentPage;
    const totalPage = get().totalPage;
    if (currentPage === totalPage) {
      return;
    } else {
      set({
        currentPage: currentPage + 1,
      });
    }
  },
  goPreviousPage() {
    const currentPage = get().currentPage;
    if (currentPage === 1) {
      return;
    } else {
      set({
        currentPage: currentPage - 1,
      });
    }
  },
  clearDataSource() {
    set({
      dataSource: [],
    });
  },
}));
