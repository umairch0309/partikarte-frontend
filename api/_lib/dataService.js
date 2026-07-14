import { getAdminPermissions, getBusinessPermissions } from "./permissions.js";
import { listRoles } from "./roleService.js";
import { readStore } from "./store.js";

function emptyListResponse(key) {
  return { data: { [key]: [] } };
}

function buildBusinessProfile(email) {
  const store = readStore();
  const user = store.users[email];
  const permissions = getBusinessPermissions();

  if (!user) {
    return {
      data: {
        user: { email, permissions },
        business: { company: {}, earnings: { currentBalance: 0, totalEarnings: 0 } },
      },
    };
  }

  return {
    data: {
      user: {
        email: user.email,
        username: user.profile?.username || "",
        name: user.profile?.username || user.profile?.companyName || "",
        permissions,
        profile_image: user.profile?.profile_image || null,
      },
      business: {
        company: {
          companyName: user.profile?.companyName || "",
          companyVAT: user.profile?.companyVAT || "",
          companyRegistryNumber: user.profile?.companyRegistryNumber || "",
          addressDescription: user.profile?.addressDescription || "",
          city: user.profile?.city || "",
          postalCode: user.profile?.postalCode || "",
          country: user.profile?.country || "",
        },
        contactInformation: {
          email: user.email,
          phoneNumber: user.profile?.phoneNumber || "",
        },
        financialInformation: user.profile?.financialInformation || {},
        marketingInformation: user.profile?.marketingInformation || {},
        earnings: {
          currentBalance: 0,
          totalEarnings: 0,
        },
      },
    },
  };
}

function buildAdminProfile(email) {
  const permissions = getAdminPermissions();

  return {
    data: {
      user: {
        email,
        permissions,
        profile_image: null,
      },
    },
  };
}

export function handleDataRequest(path, session) {
  const normalizedPath = path.replace(/^\//, "").replace(/^api\//, "");

  if (normalizedPath === "auth/get-profile") {
    if (session?.scope === "admin") {
      return buildAdminProfile(session.email);
    }
    return buildBusinessProfile(session.email);
  }

  if (
    normalizedPath === "events" ||
    normalizedPath === "events/active" ||
    normalizedPath === "all-events-for-customer"
  ) {
    return emptyListResponse("events");
  }

  if (normalizedPath === "business/businesses-for-customer") {
    return emptyListResponse("businesses");
  }

  if (normalizedPath.startsWith("business/business-for-customer/")) {
    return {
      data: {
        business: null,
        events: [],
        news: [],
      },
    };
  }

  if (normalizedPath.startsWith("single-event-for-customer/")) {
    return { data: { event: null } };
  }

  if (normalizedPath.startsWith("guests/summary/")) {
    return {
      data: {
        guestTypeSummary: [],
        summary: {
          total: 0,
          vip: 0,
          vvip: 0,
          economy: 0,
        },
      },
    };
  }

  if (normalizedPath.startsWith("guests/")) {
    return emptyListResponse("guests");
  }

  if (
    normalizedPath === "orders/latest-orders" ||
    normalizedPath.startsWith("orders/by-time/") ||
    normalizedPath.startsWith("orders/get-business-revenue-by-month/")
  ) {
    if (normalizedPath.startsWith("orders/get-business-revenue-by-month/")) {
      return {
        data: {
          revenue: 0,
          orders: [],
        },
      };
    }
    return emptyListResponse("orders");
  }

  if (normalizedPath.startsWith("orders/")) {
    return emptyListResponse("orders");
  }

  if (normalizedPath.startsWith("transactions/")) {
    return emptyListResponse("transactions");
  }

  if (normalizedPath.startsWith("coupon/")) {
    return { data: { coupon: null } };
  }

  if (normalizedPath.includes("/tickets")) {
    return emptyListResponse("tickets");
  }

  if (normalizedPath === "roles") {
    return listRoles(session?.email);
  }

  if (normalizedPath === "news") {
    return emptyListResponse("news");
  }

  if (normalizedPath === "business/business-managers") {
    return emptyListResponse("data");
  }

  if (normalizedPath === "business/gallery") {
    return emptyListResponse("gallery");
  }

  if (normalizedPath.startsWith("business/gallery/")) {
    return {
      data: {
        gallery: {
          images: [],
        },
      },
    };
  }

  if (normalizedPath.startsWith("admin/")) {
    return { data: {} };
  }

  return { data: {} };
}
