import React, { useState } from "react";
import "./PoliciesPage.scss";
import PolicySection from "../../components/PoliciesPageComponents/PolicySection";

const PoliciesPage = () => {
  const [searchedText, setSearchedText] = useState("");
  console.log(searchedText);
  return (
    <div className="policies-page-main-container">
      <div className="policies-page-header">
        <img src="/images/policies-banner.jpg" alt="policies banner" />
        <input
          placeholder="Search..."
          value={searchedText}
          onChange={(e) => setSearchedText(e.target.value)}
        />
      </div>
      <div className="policies-page-main">
        <PolicySection title={"Policies"} />
        <PolicySection title={"Articles"} />
        <PolicySection title={"Others"} />
      </div>
    </div>
  );
};

export default PoliciesPage;
