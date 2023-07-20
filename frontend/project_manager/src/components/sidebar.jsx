import React from "react";
import "../App.css"
import { sidebarContent } from "./sidebarContent";
import { useNavigate }from "react-router-dom"

export const Sidebar = () => {
    const navigate = useNavigate();
    const handleSidebarSelect = (val) => {
        
        if (val.title === "projects"){
            console.log("projects")
            navigate("/projects")
        }
    }
    return(
        <div className="sidebar">
            <ul className="sidebarList">
                {sidebarContent.map((val, key)=> {
                    return <li key={key} onClick={()=> handleSidebarSelect(val)} className="row">
                        {" "}
                        <div>{val.icon}</div>{" "}
                        <div>{ val.title}</div>
                    </li>
                })}
            </ul>
        </div>
    )
}