import { lazy } from "react";
export default {
    path: "/dating/*",
    exact: false,
    public: false,
    component: lazy(() => import("./index"))
}