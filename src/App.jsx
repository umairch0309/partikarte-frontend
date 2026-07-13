import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { ConfigProvider } from "antd";

import "./styles/main.scss";
import Page404 from "./pages/common/Page404";
import ScrollToTopOnRouteChange from "./components/service-components/ScrollToTopOnRouteChange";
import configuration from "./styles/antd-configuration/configuration";
import UserMain from "./pages/User/UserMain";
import { useAuthContext } from "./context/auth-context";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import BusinessProtectedLayout from "./components/Layouts/BusinessLayout/BusinessProtectedLayout";
import PermissionRoute from "./components/Layouts/BusinessLayout/PermissionRoute";
import GuestOnly from "./components/Layouts/BusinessLayout/GuestOnly";
import SignIn from "./pages/Business/Auth/SignIn";
import SignUp from "./pages/Business/Auth/SignUp";
import ForgotPassword from "./pages/Business/Auth/ForgotPassword";
import VerifyOTP from "./pages/Business/Auth/VerifyOTP";
import ResetPassword from "./pages/Business/Auth/ResetPassword";
import Dashboard from "./pages/Business/Dashboard";
import Guestlist from "./pages/Business/Guestlist";
import Settings from "./pages/Business/Settings";
import ManageEvents from "./pages/Business/ManageEvents";
import ManageTickets from "./pages/Business/ManageTickets";
import Orders from "./pages/Business/Orders";
import TicketsScanning from "./pages/Business/TicketsScanning";
import UserManagement from "./pages/Business/UserManagement";
import OrganizerSettings from "./pages/Business/OrganizerSettings";
import ViewEventBusiness from "./pages/Business/ViewEventBusiness";
import Customers from "./pages/Business/Customers";
import Invoices from "./pages/Business/Invoices";
import Finance from "./pages/Business/Finance";
import Roles from "./pages/Business/Roles";

function App() {
  const { setIsLoggedIn, isLoggedIn, forgotEmail } = useAuthContext();
  const navigate = useNavigate();

  const handleAuthError = (res) => {
    if (res?.response?.status === 401 && isLoggedIn) {
      setIsLoggedIn(false);
      localStorage.removeItem("token");
      navigate("/business/login");
    }
  };

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: handleAuthError,
    }),
    mutationCache: new MutationCache({
      onError: handleAuthError,
    }),
    defaultOptions: {
      queries: {
        staleTime: 120000,
        gcTime: 120000,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <ConfigProvider theme={configuration.configuration}>
      <QueryClientProvider client={queryClient}>
        <div className="app-container">
          <ScrollToTopOnRouteChange />
          <Routes>
            {/* Business auth routes (no sidebar layout) */}
            <Route
              path="/business/login"
              element={
                <GuestOnly>
                  <SignIn />
                </GuestOnly>
              }
            />
            <Route
              path="/business/signup"
              element={
                <GuestOnly>
                  <SignUp />
                </GuestOnly>
              }
            />
            <Route
              path="/business/forgot-password"
              element={
                <GuestOnly>
                  <ForgotPassword />
                </GuestOnly>
              }
            />
            <Route
              path="/business/verify-otp"
              element={
                <GuestOnly>
                  {forgotEmail ? (
                    <VerifyOTP />
                  ) : (
                    <Navigate to="/business/forgot-password" replace />
                  )}
                </GuestOnly>
              }
            />
            <Route
              path="/business/reset-password"
              element={
                <GuestOnly>
                  {forgotEmail ? (
                    <ResetPassword />
                  ) : (
                    <Navigate to="/business/forgot-password" replace />
                  )}
                </GuestOnly>
              }
            />

            {/* Business portal routes (with sidebar layout) */}
            <Route path="/business" element={<BusinessProtectedLayout />}>
              <Route
                index
                element={<Navigate to="/business/dashboard" replace />}
              />
              <Route
                path="dashboard"
                element={
                  <PermissionRoute permission="dashboard">
                    <Dashboard />
                  </PermissionRoute>
                }
              />
              <Route
                path="guestlists"
                element={
                  <PermissionRoute permission="guestlists">
                    <Guestlist />
                  </PermissionRoute>
                }
              />
              <Route
                path="settings/*"
                element={
                  <PermissionRoute permission="settings">
                    <Settings />
                  </PermissionRoute>
                }
              />
              <Route
                path="manage-events"
                element={
                  <PermissionRoute permission="manage-events">
                    <ManageEvents />
                  </PermissionRoute>
                }
              />
              <Route
                path="view-event/:eventId"
                element={
                  <PermissionRoute permission="events">
                    <ViewEventBusiness />
                  </PermissionRoute>
                }
              />
              <Route
                path="manage-tickets"
                element={
                  <PermissionRoute permission="manage-tickets">
                    <ManageTickets />
                  </PermissionRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <PermissionRoute permission="orders">
                    <Orders />
                  </PermissionRoute>
                }
              />
              <Route
                path="finance"
                element={
                  <PermissionRoute permission="finance">
                    <Finance />
                  </PermissionRoute>
                }
              />
              <Route
                path="customers"
                element={
                  <PermissionRoute permission="customers">
                    <Customers />
                  </PermissionRoute>
                }
              />
              <Route
                path="invoices"
                element={
                  <PermissionRoute permission="invoices">
                    <Invoices />
                  </PermissionRoute>
                }
              />
              <Route
                path="ticket-scanning"
                element={
                  <PermissionRoute permission="ticket-scanning">
                    <TicketsScanning />
                  </PermissionRoute>
                }
              />
              <Route
                path="user-management"
                element={
                  <PermissionRoute permission="user-management">
                    <UserManagement />
                  </PermissionRoute>
                }
              />
              <Route
                path="roles"
                element={
                  <PermissionRoute permission="roles">
                    <Roles />
                  </PermissionRoute>
                }
              />
              <Route
                path="organizer-settings/*"
                element={
                  <PermissionRoute permission="organizer-settings">
                    <OrganizerSettings />
                  </PermissionRoute>
                }
              />
              <Route
                path="*"
                element={<Navigate to="/business/dashboard" replace />}
              />
            </Route>

            <Route path="/*" element={<UserMain />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </div>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
