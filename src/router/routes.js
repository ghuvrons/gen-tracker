const routes = [
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },
];

routes.push({
  path: "*",
  component: () => import("pages/errors/Error404.vue"),
});

export default routes;
