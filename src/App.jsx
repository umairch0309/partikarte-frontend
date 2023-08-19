import { Routes, Route } from "react-router-dom";
import { ConfigProvider, BackTop, message } from "antd";

import "./styles/main.scss";
import Page404 from "./pages/common/Page404";
import ScrollToTopOnRouteChange from "./components/service-components/ScrollToTopOnRouteChange";
import configuration from "./styles/antd-configuration/configuration";
import UserMain from "./pages/User/UserMain";
import BusinessMain from "./pages/Business/BusinessMain";
import { AuthProvider } from "./context/auth-context";

function App() {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <AuthProvider>
      <ConfigProvider theme={configuration}>
        {contextHolder}
        <div className="app-container">
          <ScrollToTopOnRouteChange />
          <Routes>
            <Route path="/*" element={<UserMain />} />
            <Route path="/business/*" element={<BusinessMain />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;
