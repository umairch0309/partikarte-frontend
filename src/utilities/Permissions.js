export const Permssions = [
  {
    name: "Dashboard",
    identifier: "dashboard",
    isGranted: false,
    sub: [
      {
        name: "Ticket Sales Graph",
        identifier: "dashboardTicketSaleGraph",
        isGranted: false,
      },
      {
        name: "Balance Sheet",
        identifier: "dashboardBalanceSheet",
        isGranted: false,
      },
      {
        name: "Active Events",
        identifier: "dashboardActiveEvents",
        isGranted: false,
      },
      {
        name: "Latest Orders",
        identifier: "dashboardLatestOrders",
        isGranted: false,
      },
    ],
  },
  {
    name: "Guest List",
    identifier: "guestlists",
    isGranted: false,
    sub: [
      {
        name: "Add people to guest list",
        identifier: "guestListAddPeople",
        isGranted: false,
      },
      { name: "Edit List", identifier: "guestListEdit", isGranted: false },
      { name: "Delete List", identifier: "guestListDelete", isGranted: false },
    ],
  },
  {
    name: "Settings",
    identifier: "settings",
    isGranted: false,
    sub: [
      {
        name: "Company Information",
        identifier: "settingsCompanyInfo",
        isGranted: false,
      },
      {
        name: "Finance Information",
        identifier: "settingsFinanceInfo",
        isGranted: false,
      },
      {
        name: "Marketing Information",
        identifier: "settingsMarketingInfo",
        isGranted: false,
      },
      {
        name: "Account Information",
        identifier: "settingsAccountInfo",
        isGranted: false,
      },
    ],
  },
  {
    name: "Finance",
    identifier: "finance",
    isGranted: false,
    sub: [
      {
        name: "Transaction Stats",
        identifier: "financeTransactionStats",
        isGranted: false,
      },
      {
        name: "Transaction List",
        identifier: "financeTransactionList",
        isGranted: false,
      },
    ],
  },
  {
    name: "Invoice",
    identifier: "invoices",
    isGranted: false,
    sub: [
      {
        name: "Invoice Analytics",
        identifier: "invoiceAnalytics",
        isGranted: false,
      },
      { name: "View Invoices", identifier: "viewInvoices", isGranted: false },
      { name: "Refund", identifier: "refund", isGranted: false },
      {
        name: "Resend Tickets Email",
        identifier: "resendTicketsEmail",
        isGranted: false,
      },
    ],
  },
  {
    name: "Orders",
    identifier: "orders",
    isGranted: false,
    sub: [
      {
        name: "Orders Analytics",
        identifier: "ordersAnalytics",
        isGranted: false,
      },
      { name: "Customer List", identifier: "customerList", isGranted: false },
    ],
  },
  {
    name: "Events",
    identifier: "manage-events",
    isGranted: false,
    sub: [
      { name: "Add new event", identifier: "addNewEvent", isGranted: false },
      { name: "Update Event", identifier: "updateEvent", isGranted: false },
      { name: "Delete Ticket", identifier: "deleteTicket", isGranted: false },
      {
        name: "Tickets Analytics",
        identifier: "ticketsAnalytics",
        isGranted: false,
      },
      {
        name: "Generate Coupon code",
        identifier: "generateCouponCode",
        isGranted: false,
      },
    ],
  },
  {
    name: "Tickets",
    identifier: "manage-tickets",
    isGranted: false,
    sub: [
      { name: "Create Ticket", identifier: "createTicket", isGranted: false },
      { name: "Update Ticket", identifier: "updateTicket", isGranted: false },
      { name: "Delete Ticket", identifier: "deleteTicket", isGranted: false },
    ],
  },
  {
    name: "Customers",
    identifier: "customers",
    isGranted: false,
    sub: [
      { name: "View Customers", identifier: "viewCustomers", isGranted: false },
    ],
  },
  {
    name: "User management",
    identifier: "user-management",
    isGranted: false,
    sub: [
      { name: "Add member", identifier: "addMember", isGranted: false },
      { name: "Update member", identifier: "updateMember", isGranted: false },
      { name: "Delete member", identifier: "deleteMember", isGranted: false },
    ],
  },
  {
    name: "Organizer Settings",
    identifier: "organizer-settings",
    isGranted: false,
    sub: [
      {
        name: "Gallery Management",
        identifier: "galleryManagement",
        isGranted: false,
      },
      { name: "News", identifier: "news", isGranted: false },
      {
        name: "Company Details",
        identifier: "companyDetails",
        isGranted: false,
      },
    ],
  },
  {
    name: "Roles and Permission",
    identifier: "roles",
    isGranted: false,
    sub: [
      { name: "Add a Role", identifier: "addRole", isGranted: false },
      { name: "Delete Role", identifier: "deleteRole", isGranted: false },
      { name: "Edit Role", identifier: "editRole", isGranted: false },
    ],
  },
];
