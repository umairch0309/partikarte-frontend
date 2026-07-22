import React, { useEffect } from "react";
import "./BusinessLayout.scss";
import Sidebar from "./Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useStripeConnectStatus } from "../../../hooks/useStripeConnectStatus";
import StripeOnboardingBanner from "../../BusinessSettings/StripeOnboardingBanner";

const FINANCE_PATH = "/business/settings/finance";

const BusinessLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isStripeReady, isConnected, isLoading } = useStripeConnectStatus();

  const onFinancePage = location.pathname.startsWith(FINANCE_PATH);

  useEffect(() => {
    if (isLoading || isStripeReady) return;
    if (!onFinancePage) {
      navigate(FINANCE_PATH, { replace: true });
    }
  }, [isLoading, isStripeReady, onFinancePage, navigate]);

  return (
    <div className="business-layout-container">
      <Sidebar stripeGateActive={!isLoading && !isStripeReady} />
      <main>
        {!isLoading && !isStripeReady && (
          <StripeOnboardingBanner isConnected={isConnected} />
        )}
        {children}
      </main>
    </div>
  );
};

export default BusinessLayout;
