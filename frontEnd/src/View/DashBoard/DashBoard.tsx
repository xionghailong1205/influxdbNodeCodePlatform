import classes from "./DashBoar.module.css"
import { DnDSideBar } from './DnDSidebar/DnDsidebar';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import Content from "./Content/Content";

const DashBoard = () => {
    // init DashBoard 
    return (
        <DndProvider backend={HTML5Backend}>
            <div
                className={classes.main}
            >
                <div className={classes.header}>
                    InfluxDB No-Code UI
                </div>
                <div
                    className={classes.container}
                >
                    <div
                        className={classes.sidebar}
                    >
                        <DnDSideBar />
                    </div>
                    <div
                        className={classes.content}
                    >
                        <Content />
                    </div>
                </div>
            </div>
        </DndProvider>
    )
}

export default DashBoard