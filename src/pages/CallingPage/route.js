import { lazy } from "react";
export default {
    path: "/room/:roomId",
    exact: true,
    public: false,
    component: lazy(() => import("./index"))
}