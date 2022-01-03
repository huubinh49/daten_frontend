import { lazy } from "react";
export default {
    path: "/profile",
    exact: false,
    public: false,
    component: lazy(() => import("./index"))
}