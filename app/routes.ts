import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("presupuesto", "routes/presupuesto.tsx"),
] satisfies RouteConfig;
