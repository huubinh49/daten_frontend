import { lazy } from "react";
export default {
    path: "/create-profile",
    exact: true,
    public: false,
    component: lazy(() => import("./index"))
}