import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import "./Header.scss";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../UI/PrimaryButton";
import { useAuthContext } from "../../../context/auth-context";
import { useProfileDetails } from "../../../api/profile";
import { Dropdown, Skeleton } from "antd";
import { setEncryptedData } from "../../../utilities/EncryptedStorage";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser, setPermissions } = useAuthContext();
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();
  const [profileImageError, setProfileImageError] = useState(false);

  const { isLoading } = useProfileDetails(
    (res) => {
      const profile = res?.user ? res : res?.data;
      if (profile) {
        setUser(profile);
        setPermissions(profile?.user?.permissions || []);
        setEncryptedData("available", profile?.user?.permissions || []);
      }
    },
    (res) => {
      if (isLoggedIn) {
        if (res?.response?.status == 401) {
          console.log(res.response.status, "logged out");
          setIsLoggedIn(false);
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("available");
        }
      }
    }
  );

  const profileImage = user?.user?.profile_image?.trim();
  const showProfileImage = Boolean(profileImage) && !profileImageError;

  useEffect(() => {
    setProfileImageError(false);
  }, [profileImage]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("available");
    setIsLoggedIn(false);
    navigate("/business/login");
  };

  const items = [
    {
      label: (
        <div
          onClick={() => navigate("/business/dashboard")}
          className="button-in-dropdown"
        >
          <span>Dashboard</span>
        </div>
      ),
      key: "0",
      className: "blue-button-dropdown",
    },
    {
      label: (
        <div onClick={handleLogout} className="button-in-dropdown">
          <span>Logout</span>
        </div>
      ),
      key: "1",
      className: "red-button-dropdown",
    },
  ];

  const profileTrigger = !isLoading ? (
    showProfileImage ? (
      <img
        className="header-profile-avatar"
        src={profileImage}
        alt="Profile"
        onError={() => setProfileImageError(true)}
      />
    ) : (
      <button
        type="button"
        className="header-profile-placeholder"
        aria-label="Open account menu"
      >
        <ReactSVG src="/icons/tools/profile-avatar.svg" />
      </button>
    )
  ) : (
    <Skeleton.Avatar active={true} size={44} shape={"circle"} />
  );

  return (
    <div className="user-layout-header-container">
      <div className="user-layout-header">
        <Link to="/">
          <ReactSVG className="header-logo" src="/logo-white.svg" />
        </Link>
        <div className="header-right-side">
          <Link to={"/join-business"}>
            <h4>For Organizers</h4>
          </Link>
          {!isLoggedIn ? (
            <Link className="login-link-button" to="/business/login">
              <PrimaryButton className="header-login-button">
                Login
              </PrimaryButton>
            </Link>
          ) : (
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              placement="bottomRight"
              className="dropdown-table-actions"
            >
              {profileTrigger}
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
