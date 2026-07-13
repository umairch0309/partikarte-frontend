const businessPermissions = [
  "dashboard",
  "dashboardTicketSaleGraph",
  "dashboardBalanceSheet",
  "dashboardActiveEvents",
  "dashboardLatestOrders",
  "guestlists",
  "guestListAddPeople",
  "guestListEdit",
  "guestListDelete",
  "settings",
  "settingsCompanyInfo",
  "settingsFinanceInfo",
  "settingsMarketingInfo",
  "settingsAccountInfo",
  "finance",
  "financeTransactionStats",
  "financeTransactionList",
  "invoices",
  "invoiceAnalytics",
  "viewInvoices",
  "refund",
  "resendTicketsEmail",
  "orders",
  "ordersAnalytics",
  "customerList",
  "manage-events",
  "addNewEvent",
  "updateEvent",
  "deleteEvent",
  "ticketsAnalytics",
  "generateCouponCode",
  "events",
  "manage-tickets",
  "createTicket",
  "updateTicket",
  "deleteTicket",
  "customers",
  "viewCustomers",
  "user-management",
  "addMember",
  "updateMember",
  "deleteMember",
  "organizer-settings",
  "galleryManagement",
  "news",
  "companyDetails",
  "ticketCustomization",
  "roles",
  "addRole",
  "deleteRole",
  "editRole",
  "ticket-scanning",
];

function buildPermissionTree(identifiers) {
  return identifiers.map((identifier) => ({
    name: identifier,
    identifier,
    isGranted: true,
    sub: [],
  }));
}

export function getBusinessPermissions() {
  return buildPermissionTree(businessPermissions);
}

export function getAdminPermissions() {
  return buildPermissionTree([
    "dashboard",
    "businesses",
    "settings",
    "finance",
    "orders",
    "user-management",
    "roles",
  ]);
}
