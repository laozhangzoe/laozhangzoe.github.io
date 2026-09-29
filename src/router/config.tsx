import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import WorkOrderPage from "../pages/workOrder/page";
import WorkOrderDetailPage from "../pages/workOrder/detail/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <WorkOrderPage />,
  },
  {
    path: "/detail/:businessNumber",
    element: <WorkOrderDetailPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;