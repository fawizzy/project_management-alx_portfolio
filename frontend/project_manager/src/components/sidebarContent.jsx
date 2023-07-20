import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import Person3Icon from '@mui/icons-material/Person3';

export const sidebarContent = [
    {
        title:"home",
        link:"/home",
        icon: <HomeIcon/>
    },
    {
        title:"profile",
        link:"/profile",
        icon: <Person3Icon/>
    },
    {
        title:"projects",
        link:"/projects",
        icon: <Person3Icon/>
    },
    {
        title:"tasks",
        link:"/tasks",
        icon: <Person3Icon/>
    },
    {
        title:"log out",
        link:"/logout",
        icon: <Person3Icon/>
    }
]