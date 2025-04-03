import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout("./routes/Layout.tsx", [
        index("./routes/home.tsx"),
        route("presupuesto", "./routes/presupuesto.tsx"),
        route("estadisticas", "./routes/estadisticas.tsx"),

    ]
    ),

] satisfies RouteConfig;
