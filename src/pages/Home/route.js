import { lazy } from "react";
export default {
    path: "/",
    exact: true,
    public: true,
    component: lazy(() => import("./index"))
}