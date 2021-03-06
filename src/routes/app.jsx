import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import TableList from "views/TableList/TableList.jsx";
import Under2500Table from "views/Under2500Table/Under2500Table.jsx";
import Typography from "views/Typography/Typography.jsx";
import Icons from "views/Icons/Icons.jsx";
import Maps from "views/Maps/Maps.jsx";
import NotificationsPage from "views/Notifications/Notifications.jsx";
// import Manage from 'views/Manage/Manage.jsx';
import Deposit from 'views/Deposit/Deposit.jsx';
import Withdraw from 'views/Withdraw/Withdraw.jsx';
import Absent from 'views/Absent/Absent.jsx';
import {
    Dashboard, Person, ContentPaste, LibraryBooks, BubbleChart, LocationOn, Notifications
} from 'material-ui-icons';


const appRoutes = [
    { path: "/dashboard", sidebarName: "Dashboard", navbarName: "Material Dashboard", icon: Dashboard, component: DashboardPage },
    { path: "/user", sidebarName: "User Activity", navbarName: "Profile", icon: Person, component: UserProfile },
    // { path: "/table", sidebarName: "Table List", navbarName: "Table List", icon: ContentPaste, component: TableList },
    { path: "/under2500", sidebarName: "Under2500", navbarName: "Under2500", icon: ContentPaste, component: Under2500Table },
    { path: "/Deposit", sidebarName: "Deposit", navbarName: "Deposit", icon: LibraryBooks, component: Deposit },
    { path: "/Withdraw", sidebarName: "Withdraw", navbarName: "Withdraw", icon: LibraryBooks, component: Withdraw },
    { path: "/Absent", sidebarName: "Absent", navbarName: "Absent", icon: LibraryBooks, component: Absent },
    // { path: "/typography", sidebarName: "Typography", navbarName: "Typography", icon: LibraryBooks, component: Typography },
    // { path: "/icons", sidebarName: "Icons", navbarName: "Icons", icon: BubbleChart, component: Icons },
    // { path: "/maps", sidebarName: "Maps", navbarName: "Map", icon: LocationOn, component: Maps },
    // { path: "/notifications", sidebarName: "Notifications", navbarName: "Notifications", icon: Notifications, component: NotificationsPage },
    { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];


export default appRoutes;
