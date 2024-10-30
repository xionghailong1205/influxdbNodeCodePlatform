import { API } from "@/api"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"


import { useInfluxdbResult } from "@/state/useInfluxdbResult/useInfluxdbResult"
import { useEffect } from "react"
import { useCodeGenerator } from "@/state/useCodeGenerator"

const InfluxDBResultTable = () => {
    const dataSource = useInfluxdbResult(state => state.dataSource)
    const changeTable = useInfluxdbResult(state => state.changeTable)

    const hasResult = dataSource.length > 0 ? true : false

    const fluxQueryCode = useCodeGenerator(state => state.fluxQueryCode)

    useEffect(() => {
        const selectedMeasurement = useCodeGenerator.getState().selectedMeasurement
        console.log("代码执行:", selectedMeasurement)
        if (fluxQueryCode) {
            if (selectedMeasurement) {
                API.getFluxQueryResult({
                    newFluxCode: fluxQueryCode
                }).then(result => {
                    changeTable(result)
                })
            }
        }
    }, [fluxQueryCode])

    if (hasResult) {
        return (
            <ResultTable />
        )
    } else {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                    border: "2px dotted white"
                }}
            >
                No Result.
            </div>
        )
    }
}

const ResultTable = () => {
    const currentPage = useInfluxdbResult(state => state.currentPage)
    const resultNumberOnePage = useInfluxdbResult(state => state.resultNumberOnePage)
    const dataSource = useInfluxdbResult(state => state.dataSource);
    const headerList = useInfluxdbResult(state => state.headerList);
    const totalPage = useInfluxdbResult(state => state.totalPage)
    const goNextPage = useInfluxdbResult(state => state.goNextPage)
    const goPreviousPage = useInfluxdbResult(state => state.goPreviousPage)

    const start = resultNumberOnePage * (currentPage - 1);
    const end = start + resultNumberOnePage;

    const dataOfCurrentPage = dataSource.slice(start, end).map((dataObject) => {
        return Object.values(dataObject)
    }) as Array<Array<string>>;

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        {
                            headerList.map(headerName => {
                                return (
                                    <TableHead
                                        key={headerName}
                                    >
                                        {headerName}
                                    </TableHead>
                                )
                            })
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        dataOfCurrentPage.map(dataRow => {
                            return (
                                <TableRow
                                    key={dataRow[2]}
                                >
                                    {
                                        dataRow.map(data => {
                                            return (
                                                <TableCell
                                                    key={data}
                                                >
                                                    {data}
                                                </TableCell>
                                            )
                                        })
                                    }
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end"
                }}
            >
                <div>
                    {
                        <Pagination
                            style={{
                                width: "auto",
                            }}
                        >
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#"
                                        onClick={() => {
                                            goPreviousPage()
                                        }}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {currentPage}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#"
                                        onClick={() => {
                                            goNextPage()
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    }
                </div>
            </div >
        </>
    )
}

export default InfluxDBResultTable