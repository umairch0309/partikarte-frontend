import React, { useEffect, useRef, useState } from "react";
import "./Topbar.scss";
import { ReactSVG } from "react-svg";
import { Drawer, Dropdown, Popover, Skeleton } from "antd";
import { businessRoutes } from "../../../Routes";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/auth-context";
import { useProfileDetails } from "../../../api/profile";
import { setEncryptedData } from "../../../utilities/EncryptedStorage";

const staticNotifications = [
  {
    id: 1,
    title: "New order received",
    description: "Order #1024 was placed for Summer Festival.",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Ticket purchased",
    description: "A customer bought 2 tickets for your event.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 3,
    title: "Payout processed",
    description: "Monthly payout for March has been completed.",
    time: "Yesterday",
    unread: false,
  },
];

const NotificationsPanel = () => (
  <div className="notifications-panel">
    <div className="notifications-panel-header">
      <h4>Notifications</h4>
      <span>2 new</span>
    </div>
    <div className="notifications-list">
      {staticNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification-item ${
            notification.unread ? "unread" : ""
          }`}
        >
          <div className="notification-item-content">
            <h5>{notification.title}</h5>
            <p>{notification.description}</p>
            <span>{notification.time}</span>
          </div>
          {notification.unread && <span className="notification-dot" />}
        </div>
      ))}
    </div>
    <button type="button" className="notifications-view-all">
      View all notifications
    </button>
  </div>
);

const TopbarSearch = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const isCurrentRoute = (routePath) => {
    const pathname = location.pathname;
    if (pathname === routePath) return true;
    if (
      routePath !== "/business/dashboard" &&
      pathname.startsWith(`${routePath}/`)
    ) {
      return true;
    }
    return false;
  };

  const filteredRoutes = businessRoutes.filter(
    (route) =>
      !isCurrentRoute(route.route) &&
      route.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (route) => {
    navigate(route.route);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`search-input-container topbar-search ${className}`.trim()}
    >
      <input
        type="text"
        placeholder="Search Pages"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      <ReactSVG src="/icons/tools/search.svg" />
      {isOpen && (
        <div className="topbar-search-dropdown">
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route) => (
              <button
                key={route.route}
                type="button"
                className="topbar-search-option"
                onClick={() => handleSelect(route)}
              >
                <ReactSVG src={route.icon} />
                <span>{route.title}</span>
              </button>
            ))
          ) : (
            <p className="topbar-search-empty">No pages found</p>
          )}
        </div>
      )}
    </div>
  );
};

const Topbar = ({ title, subtitle }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, user, setUser, setPermissions } =
    useAuthContext();

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
    setUser(null);
    navigate("/business/login");
  };

  const userEmail = user?.user?.email;

  const profileMenuItems = [
    ...(userEmail
      ? [
          {
            key: "email",
            className: "topbar-profile-email-item",
            disabled: true,
            label: (
              <div className="topbar-profile-email">
                <span className="topbar-profile-email-label">Signed in as</span>
                <span className="topbar-profile-email-value">{userEmail}</span>
              </div>
            ),
          },
        ]
      : []),
    {
      key: "logout",
      className: "red-button-dropdown",
      label: (
        <div onClick={handleLogout} className="button-in-dropdown">
          <span>Logout</span>
        </div>
      ),
    },
  ];

  const profileTrigger = !isLoading ? (
    showProfileImage ? (
      <img
        src={profileImage}
        alt="Profile"
        onError={() => setProfileImageError(true)}
      />
    ) : (
      <button
        type="button"
        className="topbar-profile-placeholder"
        aria-label="Open profile menu"
      >
        <ReactSVG src="/icons/tools/profile-avatar.svg" />
      </button>
    )
  ) : (
    <Skeleton.Avatar active={true} size={44} shape={"circle"} />
  );

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning ☀️";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon 🌅";
    } else {
      return "Good Evening 🌃";
    }
  };

  return (
    <>
      <header className="topbar-container">
        <TopbarSearch className="topbar-search-mobile" />

        <div className="topbar-left">
          <h2>{title}</h2>
          <h5>
            {location?.pathname === "/business/dashboard"
              ? `Hey ${
                  user?.user?.name ||
                  user?.business?.company?.companyName?.split(" ")[0] ||
                  "User"
                }, ${getGreeting()}`
              : subtitle}
          </h5>
        </div>
        <div className="topbar-right">
          <TopbarSearch className="topbar-search-desktop" />

          <ReactSVG
            onClick={() => navigate("/")}
            className="mobile-top-bar-logo"
            src="/blue-logo.svg"
          />
          <div className="image-and-notification-container">
            <Popover
              content={<NotificationsPanel />}
              trigger="click"
              placement="bottomRight"
              arrow={false}
              overlayClassName="notifications-popover"
            >
              <div className="notifications-icon-wrapper">
                <ReactSVG
                  className="notifications-icon"
                  src="/icons/tools/notification.svg"
                />
                <span className="notifications-badge">2</span>
              </div>
            </Popover>
            <Dropdown
              menu={{ items: profileMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              {profileTrigger}
            </Dropdown>
            <ReactSVG
              onClick={showDrawer}
              className="menu-icon-mobile"
              src="/icons/menu/dashboard-icon.svg"
            />
          </div>
        </div>
      </header>
      <Drawer
        placement={"left"}
        closable={true}
        onClose={onClose}
        open={open}
        width={`${window.screen.width * 0.8}px`}
        key={"right"}
        className="mobile-menu-drawer"
      >
        <div className="side-bar-mobile-main-container">
          <ReactSVG onClick={() => navigate("/")} src="/blue-logo.svg" />
          <div className="sidebar-all-routes-container">
            {businessRoutes.map((route) => {
              return (
                <NavLink
                  key={route.title}
                  className="single-sidebar-item"
                  to={route.route}
                >
                  <ReactSVG src={route.icon} />
                  <h5>{route.title}</h5>
                </NavLink>
              );
            })}
          </div>
          <div onClick={handleLogout} className="logout-button">
            <ReactSVG src={"/icons/menu/logout-icon.svg"} />
            <h5>Logout</h5>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Topbar;
