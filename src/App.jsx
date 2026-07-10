import { Routes, Route, useNavigate } from "react-router-dom";
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
import BusinessMain from "./pages/Business/BusinessMain";
import { useAuthContext } from "./context/auth-context";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  const { setIsLoggedIn, isLoggedIn } = useAuthContext();
  const navigate = useNavigate();

  const handleAuthError = (res) => {
    console.log("hello 401");
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
            <Route path="/business/*" element={<BusinessMain />} />
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
