import { lazy } from "react";

const routes = [
    {
        path: "Home",
        component: lazy(() => import("../webpages/Home")),
        exact: true,
    },
    {
        path: "User_profile",
        component: lazy(() => import("../webpages/UserProfile")),
        exact: true,
    },
];

export default routes;
