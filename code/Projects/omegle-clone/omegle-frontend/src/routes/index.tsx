import {Routes, Route } from "react-router";


import { BrowserRouter } from "react-router-dom";

import Room from "../components/Room";
import Landing from "../components/Landing";

const AppRoutes = () => {
   
    return (
        <div><BrowserRouter>
            <Routes>
            <Route path="/" element={<Landing/>}/>
            
            <Route path='room' element ={//@ts-ignore
            <Room/>}/>
            </Routes>
        </BrowserRouter>


        </div>
    )
}

export default AppRoutes