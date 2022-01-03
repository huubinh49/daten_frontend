import { lazy } from "react";
export default {
    path: "/",
    exact: false,
    public: true,
    component: lazy(() => import("./index"))
}