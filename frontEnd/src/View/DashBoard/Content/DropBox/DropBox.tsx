import { BoxType, BucketInfo, FieldInfo, MeasurementInfo, useDnDSidebar } from '@/state/useDnDSidebar'
import classes from './DropBox.module.css'
import { useDrop } from 'react-dnd'
import { useCodeGenerator } from '@/state/useCodeGenerator'
import { TagInfo } from '../../type'
import { Cross1Icon } from '@radix-ui/react-icons'

const DropBox = () => {
    return (
        <>
            <BucketDropBox />
            <MeasurementDropBox />
            <FieldDropBox />
            <TagDropBox />
        </>

    )
}

const CancelButton = ({
    callback
}: {
    callback: Function
}) => {
    return (
        <div
            onClick={() => {
                callback()
            }}
        >
            <Cross1Icon className='cursor-pointer text-[#f6f8f9a6] hover:text-[white]' width={20} height={20} />
        </div>
    )
}

const BucketDropBox = () => {
    const handleDrop = (bucketInfo: BucketInfo) => {
        const setSelectedBucket = useCodeGenerator.getState().setSelectedBucket
        const changeSideBarState = useDnDSidebar.getState().changeSideBarState

        setSelectedBucket(bucketInfo.name)
        changeSideBarState("chooseMeasurement")
    }

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: BoxType.BucketBox,
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
            drop: handleDrop,
        }))

    const selectedBucket = useCodeGenerator(state => state.selectedBucket)
    const deleteSelectedBucket = useCodeGenerator(state => state.deleteSelectedBucket)

    // clean code
    if (selectedBucket) {
        return (
            <div
                className={classes.dropBox}
            >
                Bucket: {selectedBucket}
                <CancelButton callback={deleteSelectedBucket} />
            </div>
        )
    } else {
        return (
            <div
                className={classes.dropBox}
                ref={drop}
                style={{
                    backgroundColor: isOver ? "#11436a2e" : "",
                    border: isOver ? "1px solid white" : ""
                }}
            >
                Drop Bucket Here!
            </div>
        )
    }
}

const MeasurementDropBox = () => {
    const handleDrop = (measurementInfo: MeasurementInfo) => {
        const setSelectedMeasurement = useCodeGenerator.getState().setSelectedMeasurement
        const changeSideBarState = useDnDSidebar.getState().changeSideBarState

        setSelectedMeasurement(measurementInfo.name)
        changeSideBarState("chooseFieldAndTag")
    }

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: BoxType.MeasurementBox,
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
            drop: handleDrop,
        }))

    const selectedBucket = useCodeGenerator(state => state.selectedBucket)
    const selectedMeasurement = useCodeGenerator(state => state.selectedMeasurement)
    const deleteSelectedMeasurement = useCodeGenerator(state => state.deleteSelectedMeasurement)

    if (selectedBucket) {
        // clean code
        if (selectedMeasurement) {
            return (
                <div
                    className={classes.dropBox}
                >
                    Measurement: {selectedMeasurement}
                    <CancelButton callback={deleteSelectedMeasurement} />
                </div>
            )
        } else {
            return (
                <div
                    className={classes.dropBox}
                    ref={drop}
                    style={{
                        backgroundColor: isOver ? "#11436a2e" : "",
                        border: isOver ? "1px solid white" : ""
                    }}
                >
                    Drop Measurement Here!
                </div>
            )
        }
    }
}

const FieldDropBox = () => {
    const handleDrop = (fieldInfo: FieldInfo) => {
        const setSelectedMeasurement = useCodeGenerator.getState().setSelectedField
        const changeSideBarState = useDnDSidebar.getState().changeSideBarState

        setSelectedMeasurement(fieldInfo.name)
        changeSideBarState("chooseFieldAndTag")
    }

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: BoxType.FieldBox,
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
            drop: handleDrop,
        }))

    const selectedBucket = useCodeGenerator(state => state.selectedBucket)
    const selectedMeasurement = useCodeGenerator(state => state.selectedMeasurement)
    const selectedField = useCodeGenerator(state => state.selectedField)

    const deleteSelectedField = useCodeGenerator(state => state.deleteSelectedField)

    if (selectedBucket && selectedMeasurement) {
        // clean code
        if (selectedField) {
            return (
                <div
                    className={classes.dropBox}
                >
                    Field: {selectedField}
                    <CancelButton callback={deleteSelectedField} />
                </div>
            )
        } else {
            return (
                <div
                    className={classes.dropBox}
                    ref={drop}
                    style={{
                        backgroundColor: isOver ? "#11436a2e" : "",
                        border: isOver ? "1px solid white" : ""
                    }}
                >
                    Drop Field Here!
                </div>
            )
        }
    }
}

// 我们在这里添加一个简单的
const TagDropBox = () => {
    const handleDrop = (tagInfo: TagInfo) => {
        // TODO: 增加更换 filter 选项相关的处理逻辑
        const addSelectedTag = useCodeGenerator.getState().addSelectedTag

        addSelectedTag(tagInfo)
    }

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: BoxType.TagBox,
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
            drop: handleDrop,
        }))

    const selectedBucket = useCodeGenerator(state => state.selectedBucket)
    const selectedMeasurement = useCodeGenerator(state => state.selectedMeasurement)
    const selectedTags = useCodeGenerator(state => state.selectedTags)

    const deleteSelectedTag = useCodeGenerator.getState().deleteSelectedTag

    if (selectedBucket && selectedMeasurement) {
        // clean code
        if (selectedTags.length > 0) {
            return (
                <div
                    className={classes.tagDropBox}
                    ref={drop}
                    style={{
                        backgroundColor: isOver ? "#11436a2e" : "",
                        border: isOver ? "1px solid white" : ""
                    }}
                >
                    {
                        selectedTags.map(tagInfo => {
                            const Tagkey = Object.keys(tagInfo)[0]
                            const TagValue = tagInfo[Tagkey]

                            return (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <div
                                        key={TagValue}
                                    >
                                        {`${Tagkey} : ${TagValue}.`}
                                    </div>
                                    <CancelButton callback={() => {
                                        deleteSelectedTag(Tagkey)
                                    }} />
                                </div>
                            )
                        })
                    }
                </div>
            )
        } else {
            return (
                <div
                    className={classes.dropBox}
                    ref={drop}
                    style={{
                        backgroundColor: isOver ? "#11436a2e" : "",
                        border: isOver ? "1px solid white" : ""
                    }}
                >
                    Drop Tag Value Here!
                </div>
            )
        }
    }
}

export default DropBox