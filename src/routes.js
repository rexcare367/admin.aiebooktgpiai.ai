/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.3
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Soft UI Dashboard PRO React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard PRO React layouts
import Default from "layouts/dashboards/default";
// import Automotive from "layouts/dashboards/automotive";
// import SmartHome from "layouts/dashboards/smart-home";
// import VRDefault from "layouts/dashboards/virtual-reality/vr-default";
// import VRInfo from "layouts/dashboards/virtual-reality/vr-info";
import CRM from "layouts/dashboards/crm";
// import ProfileOverview from "layouts/pages/profile/profile-overview";
// import Teams from "layouts/pages/profile/teams";
// import AllProjects from "layouts/pages/profile/all-projects";
// import Reports from "layouts/pages/users/reports";
// import NewUser from "layouts/pages/users/new-user";
// import Settings from "layouts/pages/account/settings";
// import Billing from "layouts/pages/account/billing";
// import Invoice from "layouts/pages/account/invoice";
// import Security from "layouts/pages/account/security";
import NewEbook from "layouts/pages/ebooks/new";
import EbooksList from "layouts/pages/ebooks/list";
import UsersList from "layouts/pages/users/list";
import General from "layouts/pages/whatsapp/general";
import Timeline from "layouts/pages/whatsapp/timeline";
import Dashboard from "layouts/pages/whatsapp/dashboard";
// import Widgets from "layouts/pages/widgets";
// import Charts from "layouts/pages/charts";
// import SweetAlerts from "layouts/pages/sweet-alerts";
// import Notifications from "layouts/pages/notifications";
// import PricingPage from "layouts/pages/pricing-page";
// import RTL from "layouts/pages/rtl";
// import Kanban from "layouts/applications/kanban";
// import Wizard from "layouts/applications/wizard";
import DataTables from "layouts/applications/data-tables";
// import Calendar from "layouts/applications/calendar";
import Analytics from "layouts/applications/analytics";
// import Overview from "layouts/rewards/overview";
import NewReward from "layouts/rewards/rewards/new-reward";
import EditReward from "layouts/rewards/rewards/edit-reward";
import RewardPage from "layouts/rewards/rewards/reward-page";
import RewardsList from "layouts/rewards/rewards/reward-list";
import LeaderboardQuizScore from "layouts/leaderboard/quiz-score";
import LeaderboardReadBooks from "layouts/leaderboard/read-books";
import LeaderboardReadTime from "layouts/leaderboard/read-time";
// import OrderList from "layouts/rewards/orders/order-list";
// import OrderDetails from "layouts/rewards/orders/order-details";
// import Referral from "layouts/rewards/referral";
import AdminSignIn from "layouts/authentication/sign-in/basic";
// import SignInCover from "layouts/authentication/sign-in/cover";
// import SignInIllustration from "layouts/authentication/sign-in/illustration";
// import SignUpBasic from "layouts/authentication/sign-up/basic";
// import SignUpCover from "layouts/authentication/sign-up/cover";
// import SignUpIllustration from "layouts/authentication/sign-up/illustration";
// import ResetBasic from "layouts/authentication/reset-password/basic";
// import ResetCover from "layouts/authentication/reset-password/cover";
// import ResetIllustration from "layouts/authentication/reset-password/illustration";
// import LockBasic from "layouts/authentication/lock/basic";
// import LockCover from "layouts/authentication/lock/cover";
// import LockIllustration from "layouts/authentication/lock/illustration";
// import VerificationBasic from "layouts/authentication/2-step-verification/basic";
// import VerificationCover from "layouts/authentication/2-step-verification/cover";
// import VerificationIllustration from "layouts/authentication/2-step-verification/illustration";
// import Error404 from "layouts/authentication/error/404";
// import Error500 from "layouts/authentication/error/500";
// import ReadingProgress from "layouts/pages/reading-progress/analytics/index";
import ReadingProgressList from "layouts/pages/reading-progress/list";
// import ReadingProgressAnalytics from "layouts/pages/reading-progress/analytics";
import RewardsTest from "test/RewardsTest";

// Soft UI Dashboard PRO React icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import SettingsIcon from "examples/Icons/Settings";
import Basket from "examples/Icons/Basket";
import Document from "examples/Icons/Document";
// import SpaceShip from "examples/Icons/SpaceShip";
// import CustomerSupport from "examples/Icons/CustomerSupport";
// import CreditCard from "examples/Icons/CreditCard";
// import { Hidden } from "@mui/material";

const routes = [
  {
    type: "item", // Changed from "collapse" to "item"
    name: "Dashboard", // Changed from "Dashboards" to singular
    key: "dashboard",
    icon: <Shop size="12px" />,
    route: "/dashboards/default", // Direct route to default dashboard
    component: <Default />,
  },
  // {
  //   type: "collapse",
  //   name: "Dashboards",
  //   key: "dashboards",
  //   icon: <Shop size="12px" />,
  //   collapse: [
  //     {
  //       name: "Default",
  //       key: "default",
  //       route: "/dashboards/default",
  //       component: <Default />,
  //     },
  // {
  //   name: "Automotive",
  //   key: "automotive",
  //   route: "/dashboards/automotive",
  //   component: <Automotive />,
  // },
  // {
  //   name: "CRM",
  //   key: "crm",
  //   route: "/dashboards/crm",
  //   component: <CRM />,
  // },
  //   ],
  // },
  { type: "title", title: "Pages", key: "title-pages" },
  {
    type: "collapse",
    name: "eBooks",
    key: "ebooks",
    icon: <Office size="12px" />,
    collapse: [
      // {
      //       name: "Profile",
      //       key: "profile",
      //       collapse: [
      //         {
      //           name: "Profile Overview",
      //           key: "profile-overview",
      //           route: "/pages/profile/profile-overview",
      //           component: <ProfileOverview />,
      //         },
      //         {
      //           name: "Teams",
      //           key: "teams",
      //           route: "/pages/profile/teams",
      //           component: <Teams />,
      //         },
      //         {
      //           name: "All Projects",
      //           key: "all-projects",
      //           route: "/pages/profile/all-projects",
      //           component: <AllProjects />,
      //   ],
      // },
      //     {
      //       name: "Users",
      //       key: "users",
      //       collapse: [
      //         {
      //           name: "Reports",
      //           key: "reports",
      //           route: "/pages/users/reports",
      //           component: <Reports />,
      //         },
      //         {
      //           name: "New User",
      //           key: "new-user",
      //           route: "/pages/users/new-user",
      //           component: <NewUser />,
      //         },
      //       ],
      //     },
      //     {
      //       name: "Account",
      //       key: "account",
      //       collapse: [
      //         {
      //           name: "Settings",
      //           key: "settings",
      //           route: "/pages/account/settings",
      //           component: <Settings />,
      //         },
      //         {
      //           name: "Billing",
      //           key: "billing",
      //           route: "/pages/account/billing",
      //           component: <Billing />,
      //         },
      //         {
      //           name: "Invoice",
      //           key: "invoice",
      //           route: "/pages/account/invoice",
      //           component: <Invoice />,
      //         },
      //         {
      //           name: "Security",
      //           key: "security",
      //           route: "/pages/account/security",
      //           component: <Security />,
      //         },
      //       ],
      //     },
      // {
      //   name: "Users",
      //   key: "users",
      //   route: "/users/list",
      //   component: <UsersList />,
      // },
      {
        name: "Ebooks",
        key: "ebooks",
        route: "/pages/ebook/list",
        component: <EbooksList />,
      },
      {
        name: "Reading Progress",
        key: "reading-progress",
        route: "/pages/reading-progress/list",
        component: <ReadingProgressList />,
        // collapse: [
        //   {
        //     name: "List",
        //     key: "reading-progress-list",
        //     route: "/pages/reading-progress/list",
        //     component: <ReadingProgressList />,
        //   },
        // {
        //   name: "Analytics",
        //   key: "reading-progress-analytics",
        //   route: "/pages/reading-progress/analytics",
        //   component: <ReadingProgressAnalytics />,
        // },
        // ],
      },
      // {
      //   name: "Whatsapp",
      //   key: "whatsapp",
      //   collapse: [
      //     {
      //       name: "General",
      //       key: "general",
      //       route: "/pages/whatsapp/general",
      //       component: <General />,
      //     },
      //     {
      //       name: "Timeline",
      //       key: "timeline",
      //       route: "/pages/whatsapp/timeline",
      //       component: <Timeline />,
      //     },
      //     {
      //       name: "Dashboard",
      //       key: "dashboard",
      //       route: "/pages/whatsapp/dashboard",
      //       component: <Dashboard />,
      //     },
      //   ],
      //   protected: true,
      //   adminOnly: true,
      // },
      // {
      //   name: "Rewards Test",
      //   key: "rewards-test",
      //   route: "/test/RewardsTest",
      //   component: <RewardsTest />,
      // },
      //     {
      //       name: "Pricing Page",
      //       key: "pricing-page",
      //       route: "/pages/pricing-page",
      //       component: <PricingPage />,
      //     },
      //     { name: "RTL", key: "rtl", route: "/pages/rtl", component: <RTL /> },
      //     { name: "Widgets", key: "widgets", route: "/pages/widgets", component: <Widgets /> },
      //     { name: "Charts", key: "charts", route: "/pages/charts", component: <Charts /> },
      //     {
      //       name: "Sweet Alerts",
      //       key: "sweet-alerts",
      //       route: "/pages/sweet-alerts",
      //       component: <SweetAlerts />,
      //     },
      //     {
      //       name: "Notfications",
      //       key: "notifications",
      //       route: "/pages/notifications",
      //       component: <Notifications />,
      //     },
    ],
  },
  {
    type: "collapse",
    name: "Database",
    key: "database",
    icon: <SettingsIcon size="12px" />,
    collapse: [
      //     {
      //       name: "Kanban",
      //       key: "kanban",
      //       route: "/applications/kanban",
      //       component: <Kanban />,
      //     },
      //     {
      //       name: "Wizard",
      //       key: "wizard",
      //       route: "/applications/wizard",
      //       component: <Wizard />,
      //     },
      {
        name: "Student Database",
        key: "student-database",
        route: "/applications/data-tables",
        component: <DataTables />,
      },
      //     {
      //       name: "Calendar",
      //       key: "calendar",
      //       route: "/applications/calendar",
      //       component: <Calendar />,
      //     },
      {
        name: "Analytics",
        key: "analytics",
        route: "/applications/analytics",
        component: <Analytics />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Rewards",
    key: "rewards",
    icon: <Basket size="12px" />,
    noCollapse: true,
    collapse: [
      // {
      //   name: "Overview",
      //   key: "overview",
      //   route: "/rewards/overview",
      //   component: <Overview />,
      // },
      {
        name: "New Reward",
        key: "new-reward",
        route: "/rewards/rewards/new-reward",
        component: <NewReward />,
      },
      {
        name: "Edit Reward",
        key: "edit-reward",
        route: "/rewards/rewards/edit-reward/:rewardId",
        component: <EditReward />,
        hidden: true,
        showInNav: false,
      },
      {
        name: "Reward Page",
        key: "reward-page",
        route: "/rewards/rewards/reward-page/:rewardId",
        component: <RewardPage />,
        hidden: true,
        showInNav: false,
      },
      {
        name: "Rewards List",
        key: "rewards-list",
        route: "/rewards/rewards/reward-list",
        component: <RewardsList />,
      },
      // {
      //   name: "Orders",
      //   key: "orders",
      //   collapse: [
      //     {
      //       name: "Order List",
      //       key: "order-list",
      //       route: "/rewards/orders/order-list",
      //       component: <OrderList />,
      //     },
      //     {
      //       name: "Order Details",
      //       key: "order-details",
      //       route: "/rewards/orders/order-details",
      //       component: <OrderDetails />,
      //     },
      //   ],
      // },
      // {
      //   name: "Referral",
      //   key: "referral",
      //   route: "/rewards/referral",
      //   component: <Referral />,
      // },
    ],
  },
  {
    type: "collapse",
    name: "Leaderboard",
    key: "leaderboard",
    icon: <Basket size="12px" />,
    noCollapse: true,
    collapse: [
      {
        name: "Read Books",
        key: "leaderboard-page",
        route: "/leaderboard/read-books",
        component: <LeaderboardReadBooks />,
      },
      {
        name: "Read Time",
        key: "leaderboard-page",
        route: "/leaderboard/read-time",
        component: <LeaderboardReadTime />,
      },
      {
        name: "Quiz Scores",
        key: "leaderboard-page",
        route: "/leaderboard/quiz-scores",
        component: <LeaderboardQuizScore />,
      },
    ],
  },

  {
    type: "collapse",
    name: "Communication",
    key: "communication",
    icon: <Document size="12px" />,
    collapse: [
      {
        name: "Whatsapp",
        key: "whatsapp",
        route: "/pages/whatsapp",
        collapse: [
          // {
          //   name: "General",
          //   key: "general",
          //   route: "/pages/whatsapp/general",
          //   component: <General />,
          // },
          // {
          //   name: "Timeline",
          //   key: "timeline",
          //   route: "/pages/whatsapp/timeline",
          //   component: <Timeline />,
          // },
          {
            name: "Dashboard",
            key: "dashboard",
            route: "/pages/whatsapp/dashboard",
            component: <Dashboard />,
          },
        ],
        protected: true,
        adminOnly: true,
      },
    ],
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Authentication",
    key: "authentication",
    icon: <Document size="12px" />,
    hidden: true,
    collapse: [
      {
        name: "Sign In",
        key: "sign-in",
        collapse: [
          {
            name: "Basic",
            key: "basic",
            route: "/authentication/sign-in/basic",
            component: <AdminSignIn />,
            hidden: true,
          },
          //         {
          //           name: "Cover",
          //           key: "cover",
          //           route: "/authentication/sign-in/cover",
          //           component: <SignInCover />,
          //         },
          //         {
          //           name: "Illustration",
          //           key: "illustration",
          //           route: "/authentication/sign-in/illustration",
          //           component: <SignInIllustration />,
          //         },
        ],
      },
      //     {
      //       name: "Sign Up",
      //       key: "sign-up",
      //       collapse: [
      //         {
      //           name: "Basic",
      //           key: "basic",
      //           route: "/authentication/sign-up/basic",
      //           component: <SignUpBasic />,
      //         },
      //         {
      //           name: "Cover",
      //           key: "cover",
      //           route: "/authentication/sign-up/cover",
      //           component: <SignUpCover />,
      //         },
      //         {
      //           name: "Illustration",
      //           key: "illustration",
      //           route: "/authentication/sign-up/illustration",
      //           component: <SignUpIllustration />,
      //         },
      //       ],
      //     },
      //     {
      //       name: "Reset Password",
      //       key: "reset-password",
      //       collapse: [
      //         {
      //           name: "Basic",
      //           key: "basic",
      //           route: "/authentication/reset-password/basic",
      //           component: <ResetBasic />,
      //         },
      //         {
      //           name: "Cover",
      //           key: "cover",
      //           route: "/authentication/reset-password/cover",
      //           component: <ResetCover />,
      //         },
      //         {
      //           name: "Illustration",
      //           key: "illustration",
      //           route: "/authentication/reset-password/illustration",
      //           component: <ResetIllustration />,
      //         },
      //       ],
      //     },
      //     {
      //       name: "Lock",
      //       key: "lock",
      //       collapse: [
      //         {
      //           name: "Basic",
      //           key: "basic",
      //           route: "/authentication/lock/basic",
      //           component: <LockBasic />,
      //         },
      //         {
      //           name: "Cover",
      //           key: "cover",
      //           route: "/authentication/lock/cover",
      //           component: <LockCover />,
      //         },
      //         {
      //           name: "Illustration",
      //           key: "illustration",
      //           route: "/authentication/lock/illustration",
      //           component: <LockIllustration />,
      //         },
      //       ],
      //     },
      //     {
      //       name: "2-Step Verification",
      //       key: "2-step-verification",
      //       collapse: [
      //         {
      //           name: "Basic",
      //           key: "basic",
      //           route: "/authentication/verification/basic",
      //           component: <VerificationBasic />,
      //         },
      //         {
      //           name: "Cover",
      //           key: "cover",
      //           route: "/authentication/verification/cover",
      //           component: <VerificationCover />,
      //         },
      //         {
      //           name: "Illustration",
      //           key: "illustration",
      //           route: "/authentication/verification/illustration",
      //           component: <VerificationIllustration />,
      //         },
      //       ],
      //     },
      //     {
      //       name: "Error",
      //       key: "error",
      //       collapse: [
      //         {
      //           name: "Error 404",
      //           key: "error-404",
      //           route: "/authentication/error/404",
      //           component: <Error404 />,
      //         },
      //         {
      //           name: "Error 500",
      //           key: "error-500",
      //           route: "/authentication/error/500",
      //           component: <Error500 />,
      //         },
      //       ],
      //     },
    ],
  },
  // { type: "divider", key: "divider-1" },
  // { type: "title", title: "Docs", key: "title-docs" },
  // {
  //   type: "collapse",
  //   name: "Basic",
  //   key: "basic",
  //   icon: <SpaceShip size="12px" />,
  //   collapse: [
  //     {
  //       name: "Getting Started",
  //       key: "getting-started",
  //       collapse: [
  //         {
  //           name: "Overview",
  //           key: "overview",
  //           href: "https://www.creative-tim.com/learning-lab/react/overview/soft-ui-dashboard/",
  //         },
  //         {
  //           name: "License",
  //           key: "license",
  //           href: "https://www.creative-tim.com/learning-lab/react/license/soft-ui-dashboard/",
  //         },
  //         {
  //           name: "Quick Start",
  //           key: "quick-start",
  //           href: "https://www.creative-tim.com/learning-lab/react/quick-start/soft-ui-dashboard/",
  //         },
  //         {
  //           name: "Build Tools",
  //           key: "build-tools",
  //           href: "https://www.creative-tim.com/learning-lab/react/build-tools/soft-ui-dashboard/",
  //         },
  //       ],
  //     },
  //     {
  //       name: "Foundation",
  //       key: "foundation",
  //       collapse: [
  //         {
  //           name: "Colors",
  //           key: "colors",
  //           href: "https://www.creative-tim.com/learning-lab/react/colors/soft-ui-dashboard/",
  //         },
  //         {
  //           name: "Grid",
  //           key: "grid",
  //           href: "https://www.creative-tim.com/learning-lab/react/grid/soft-ui-dashboard/",
  //         },
  //         {
  //           name: "Typography",
  //           key: "base-typography",
  //           href: "https://www.creative-tim.com/learning-lab/react/base-typography/soft-ui-dashboard/",
  //         },
  //         {
  //           name: "Borders",
  //           key: "borders",
  //           href: "https://www.creative-tim.com/learning-lab/react/borders/soft-ui-dashboard/",
  //         },
  //         {
  //           name: "Box Shadows",
  //           key: "box-shadows",
  //           href: "https://www.creative-tim.com/learning-lab/react/box-shadows/soft-ui-dashboard/",
  //         },
  //         {
  //           name: "Functions",
  //           key: "functions",
  //           href: "https://www.creative-tim.com/learning-lab/react/functions/soft-ui-dashboard/",
  //         },
  //         {
  //           name: "Routing System",
  //           key: "routing-system",
  //           href: "https://www.creative-tim.com/learning-lab/react/routing-system/soft-ui-dashboard/",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   type: "collapse",
  //   name: "Components",
  //   key: "components",
  //   icon: <CustomerSupport size="12px" />,
  //   collapse: [
  //     {
  //       name: "Alerts",
  //       key: "alerts",
  //       href: "https://www.creative-tim.com/learning-lab/react/alerts/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Avatar",
  //       key: "avatar",
  //       href: "https://www.creative-tim.com/learning-lab/react/avatar/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Badge",
  //       key: "badge",
  //       href: "https://www.creative-tim.com/learning-lab/react/badge/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Badge Dot",
  //       key: "badge-dot",
  //       href: "https://www.creative-tim.com/learning-lab/react/badge-dot/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Box",
  //       key: "box",
  //       href: "https://www.creative-tim.com/learning-lab/react/box/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Buttons",
  //       key: "buttons",
  //       href: "https://www.creative-tim.com/learning-lab/react/buttons/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Date Picker",
  //       key: "date-picker",
  //       href: "https://www.creative-tim.com/learning-lab/react/datepicker/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Dropzone",
  //       key: "dropzone",
  //       href: "https://www.creative-tim.com/learning-lab/react/dropzone/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Editor",
  //       key: "editor",
  //       href: "https://www.creative-tim.com/learning-lab/react/quill/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Input",
  //       key: "input",
  //       href: "https://www.creative-tim.com/learning-lab/react/input/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Pagination",
  //       key: "pagination",
  //       href: "https://www.creative-tim.com/learning-lab/react/pagination/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Progress",
  //       key: "progress",
  //       href: "https://www.creative-tim.com/learning-lab/react/progress/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Select",
  //       key: "select",
  //       href: "https://www.creative-tim.com/learning-lab/react/select/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Snackbar",
  //       key: "snackbar",
  //       href: "https://www.creative-tim.com/learning-lab/react/snackbar/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Social Button",
  //       key: "social-button",
  //       href: "https://www.creative-tim.com/learning-lab/react/social-buttons/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Tag Input",
  //       key: "tag-input",
  //       href: "https://www.creative-tim.com/learning-lab/react/tag-input/soft-ui-dashboard/",
  //     },
  //     {
  //       name: "Typography",
  //       key: "typography",
  //       href: "https://www.creative-tim.com/learning-lab/react/typography/soft-ui-dashboard/",
  //     },
  //   ],
  // },
  // {
  //   type: "collapse",
  //   name: "Change Log",
  //   key: "changelog",
  //   href: "https://github.com/creativetimofficial/ct-soft-ui-dashboard-pro-react/blob/main/CHANGELOG.md",
  //   icon: <CreditCard size="12px" />,
  //   noCollapse: true,
  // },
];

export default routes;
