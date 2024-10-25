"use client"

import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useCodeGenerator } from "@/state/useCodeGenerator"

export function DatePickerDemo() {
    const date = useCodeGenerator(state => state.selectedDateRange)
    const setSelectedDateRange = useCodeGenerator(state => state.setSelectedDateRange)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}

                    style={{
                        backgroundColor: "#1a1a2a",
                        color: "white"
                    }}
                >
                    <CalendarIcon />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start"
                style={{
                    backgroundColor: "#1a1a2a",
                    color: "white"
                }}
            >
                <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setSelectedDateRange}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    )
}
