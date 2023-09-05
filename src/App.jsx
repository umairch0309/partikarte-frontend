import { Routes, Route, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, BackTop } from "antd";

import "./styles/main.scss";
import Page404 from "./pages/common/Page404";
import ScrollToTopOnRouteChange from "./components/service-components/ScrollToTopOnRouteChange";
import configuration from "./styles/antd-configuration/configuration";
import UserMain from "./pages/User/UserMain";
import BusinessMain from "./pages/Business/BusinessMain";
import { useAuthContext } from "./context/auth-context";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  const { setIsLoggedIn } = useAuthContext();
  const navigate = useNavigate();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        onError: (res) => {
          console.log("hello 401");
          if (res?.response?.status === 401) {
            setIsLoggedIn(false);
            localStorage.removeItem("token");
            navigate("/business/login");
          }
        },
        staleTime: 120000,
        cacheTime: 120000,
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: (res) => {
          if (res?.response?.status === 401) {
            console.log("hello 401");
            setIsLoggedIn(false);
            localStorage.removeItem("token");
            navigate("/business/login");
          }
        },
      },
    },
  });

  return (
    <ConfigProvider theme={configuration}>
      <QueryClientProvider client={queryClient}>
        <div className="app-container">
          <ScrollToTopOnRouteChange />
          <Routes>
            <Route path="/*" element={<UserMain />} />
            <Route path="/business/*" element={<BusinessMain />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </div>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
