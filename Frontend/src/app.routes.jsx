import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home.jsx";
import PreviousPlans from "./features/interview/pages/PreviousPlans.jsx";
import Interview from "./features/interview/pages/Interview.jsx";

export const router = createBrowserRouter([
    {
        path:"/login",
        element:(<Login/>)
    },
    {
        path:"/register",
        element:(<Register/>)
    },
    {
        path:"/",
        element:(<Protected> <Home/></Protected>)
    },
    {
        path:"/plans",
        element:(<Protected> <PreviousPlans/></Protected>)
    },
    {
        path:"/interview/:interviewId",
        element:(
        <Protected>
            <Interview/>
        </Protected>)
    }
])