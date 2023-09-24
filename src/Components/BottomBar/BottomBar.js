import React from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import "./BottomBar.css"

const BottomBar = props => (
    <BottomNavigation {...props}>
        {props.children}
    </BottomNavigation>
)

export default BottomBar;