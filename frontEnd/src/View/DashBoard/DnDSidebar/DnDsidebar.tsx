import { BucketInfo, useDnDSidebar, BoxType, MeasurementInfo, FieldInfo, TagKeyInfo, TagValueInfo } from "@/state/useDnDSidebar"
import classes from "./DnDsidebar.module.css"
import { useEffect, useState } from "react"
import { useDrag } from "react-dnd"
import { useCodeGenerator } from "@/state/useCodeGenerator"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { API } from "@/api"
import { TagInfo } from "../type"

const DnDSideBar = () => {
    // rendering according sidebar state
    const sidebarState = useDnDSidebar(state => state.sideBarState)

    switch (sidebarState) {
        case "chooseBucket": {
            return (
                <BucketList />
            )
        }
        case "chooseMeasurement": {
            return (
                <MeasurementList />
            )
        }
        case "chooseFieldAndTag": {
            return (
                <>
                    <FieldList />
                    <TagKeyList />
                </>
            )
        }
    }
}

const BucketBox = ({ bucketInfo }: {
    bucketInfo: BucketInfo
}) => {
    const [{ opacity }, dragRef] = useDrag(
        () => ({
            type: BoxType.BucketBox,
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.5 : 1,
                isDragging: monitor.isDragging(),
            }),
            item: (): BucketInfo => {
                return bucketInfo
            }
        }),
        []
    )

    return (
        <div
            className={classes.draggableBox}
            ref={dragRef}
        >
            <div>{bucketInfo.name}</div>
        </div>
    )
}

const BucketList = () => {
    // we fetch data every time when component mounted
    const bucketList = useDnDSidebar(state => state.bucketList)

    useEffect(() => {
        const initBucketList = useDnDSidebar.getState().fetchBucketList

        initBucketList()
    }, [])

    return (
        <>
            <div
                className={classes.sidebarTitle}
            >
                Bucket List
            </div>
            {
                bucketList.map((bucketInfo) => {
                    return (
                        <BucketBox bucketInfo={bucketInfo} key={bucketInfo.name} />
                    )
                })
            }
        </>
    )
}

const MeasurementBox = ({ measurementInfo }: {
    measurementInfo: MeasurementInfo
}) => {
    const [{ opacity }, dragRef] = useDrag(
        () => ({
            type: BoxType.MeasurementBox,
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.5 : 1,
                isDragging: monitor.isDragging(),
            }),
            item: (): BucketInfo => {
                return measurementInfo
            }
        }),
        []
    )

    return (
        <div
            className={classes.draggableBox}
            ref={dragRef}
        >
            <div>{measurementInfo.name}</div>
        </div>
    )
}

const MeasurementList = () => {
    // we fetch data every time when component mounted
    const measurementList = useDnDSidebar(state => state.measurementList)

    useEffect(() => {
        const fetchMeasurementList = useDnDSidebar.getState().fetchMeasurementList
        const selectedBucket = useCodeGenerator.getState().selectedBucket!

        fetchMeasurementList(selectedBucket)
    }, [])

    return (
        <>
            <div
                className={classes.sidebarTitle}
            >
                Measurement List
            </div>
            {
                measurementList.map((measurementInfo) => {
                    return (
                        <MeasurementBox measurementInfo={measurementInfo} key={measurementInfo.name} />
                    )
                })
            }
        </>
    )
}

const FieldBox = ({ fieldInfo }: {
    fieldInfo: FieldInfo
}) => {
    const [{ opacity }, dragRef] = useDrag(
        () => ({
            type: BoxType.FieldBox,
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.5 : 1,
                isDragging: monitor.isDragging(),
            }),
            item: (): FieldInfo => {
                return fieldInfo
            }
        }),
        []
    )

    return (
        <div
            className={classes.draggableBox}
            ref={dragRef}
        >
            <div>{fieldInfo.name}</div>
        </div>
    )
}

const FieldList = () => {
    const fieldList = useDnDSidebar(state => state.fieldList)

    useEffect(() => {
        const fetchFieldList = useDnDSidebar.getState().fetchFieldList
        const selectedBucket = useCodeGenerator.getState().selectedBucket!
        const selectedMeasurement = useCodeGenerator.getState().selectedMeasurement!

        fetchFieldList(selectedBucket, selectedMeasurement)
    }, [])

    return (
        <>
            <div
                className={classes.sidebarTitle}
            >
                Field List
            </div>

            {
                fieldList.map((fieldInfo) => {
                    return (
                        <FieldBox fieldInfo={fieldInfo} key={fieldInfo.name} />
                    )
                })
            }
        </>
    )
}

const TagKeyBox = ({ tagKeyInfo }: {
    tagKeyInfo: TagKeyInfo
}) => {
    const [tagValueList, setTagValueList] = useState<Array<TagValueInfo>>([])

    // Nesting TagValueBox
    useEffect(() => {
        const selectedBucket = useCodeGenerator.getState().selectedBucket!
        const selectedMeasurement = useCodeGenerator.getState().selectedMeasurement!

        API.fetchTagValueList({
            bucketName: selectedBucket,
            measurementName: selectedMeasurement,
            tagName: tagKeyInfo.name
        }).then(tagValueList => {
            setTagValueList(tagValueList)
        })
    }, [])

    return (
        <Accordion type="multiple"
            style={{
                width: "90%",
                marginTop: "10px"
            }}
        >
            <AccordionItem value="item-1"
                style={{
                    border: "none"
                }}
            >
                <AccordionTrigger
                    style={{
                        border: "none",
                        fontSize: "18px",
                        padding: "13px 10px",
                        fontWeight: "normal"
                    }}
                >
                    {tagKeyInfo.name}
                </AccordionTrigger>
                {
                    tagValueList.map(tagValueInfo => {
                        return (
                            <TagValueBox
                                tagKey={tagKeyInfo.name}
                                tagValue={tagValueInfo.name}
                                key={tagValueInfo.name}
                            />
                        )
                    })
                }
            </AccordionItem>
        </Accordion>
    )
}

const TagValueBox = ({
    tagKey,
    tagValue
}: {
    tagKey: string,
    tagValue: string
}) => {
    const [{ opacity }, dragRef] = useDrag(
        () => ({
            type: BoxType.TagBox,
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.5 : 1,
                isDragging: monitor.isDragging(),
            }),
            item: (): TagInfo => {
                return (
                    {
                        [tagKey]: tagValue
                    }
                )
            }
        }),
        []
    )

    return (
        <AccordionContent
            className="p-3 px-5 hover:bg-[#99b2c912]"
            style={{
                userSelect: "none"
            }}
            ref={dragRef}

        >
            {tagValue}
        </AccordionContent>
    )
}

const TagKeyList = () => {
    const tagKeyList = useDnDSidebar(state => state.tagKeyList)

    useEffect(() => {
        const fetchTagKeyList = useDnDSidebar.getState().fetchTagKeyList
        const selectedBucket = useCodeGenerator.getState().selectedBucket!
        const selectedMeasurement = useCodeGenerator.getState().selectedMeasurement!

        fetchTagKeyList(selectedBucket, selectedMeasurement)
    }, [])

    return (
        <>
            <div
                className={classes.sidebarTitle}
            >
                Tag Key List
            </div>
            {
                tagKeyList.map((tagKeyInfo) => {
                    return (
                        <TagKeyBox
                            tagKeyInfo={tagKeyInfo}
                            key={tagKeyInfo.name}
                        />
                    )
                })
            }
        </>
    )
}

export {
    DnDSideBar
}