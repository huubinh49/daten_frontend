import { lazy } from "react";
export default {
    path: "/dating/*",
    exact: true,
    public: false,
    component: lazy(() => import("./index"))
}