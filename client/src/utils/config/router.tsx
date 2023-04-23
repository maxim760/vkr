import { createBrowserRouter, Navigate } from "react-router-dom";
import { RoleTypes } from "src/api/types/models/User";
import { RequireAuth } from "src/components/utils/router/RequireAuth";
import { CertificateGiftPage, CertificatePage, HomePage, IngredientsPage, LoginPage, MenuPage, NotFoundPage, OrderPage, OrdersPage, SignupPage } from "src/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <HomePage />
      </RequireAuth>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/menu",
    element: (
      <RequireAuth>
        <MenuPage />
      </RequireAuth>
    ),
  },
  {
    path: "/ingredients",
    element: (
      <RequireAuth role={RoleTypes.Admin}>
        <IngredientsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/order",
    children: [
      {
        path: "history",
        element: (
          <RequireAuth>
            <OrdersPage />
          </RequireAuth>
        )
      },
      {
        path: ":id",
        element: (
          <RequireAuth>
            <OrderPage />
          </RequireAuth>
        )
      },
      {
        path: "*",
        element: <Navigate replace to="/order/history" />
      },
      {
        index: true,
        element: <Navigate replace to="/order/history" />
      }
    ]
  },
  {
    path: "/certificate",
    children: [
      {
        index: true,
        element: (
          <RequireAuth>
            <CertificatePage />
          </RequireAuth>
        )
      },
      {
        path: ":id",
        element: (
          <RequireAuth>
            <CertificateGiftPage />
          </RequireAuth>
        )
      },
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
])