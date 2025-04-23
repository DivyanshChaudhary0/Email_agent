
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Auth from "../views/Auth"

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/auth" element={<Auth/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes