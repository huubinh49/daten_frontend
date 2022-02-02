import { lazy } from "react";
export default {
    path: "/create-profile",
    exact: false,
    public: false,
    component: lazy(() => import("./index"))
}