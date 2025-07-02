import { FC } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import  Login  from "./pages/login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard/Dashboard";

import Profile from "./pages/dashboard/Profile";
import MembersPage from "./pages/dashboard/Members";
;
import Payments from "./pages/dashboard/Payment";
import SettingsPage from "./pages/dashboard/Settings";
import Notifications from "./pages/dashboard/notification";


export const Router: FC = () => {
	return (
		<HashRouter>
			<Routes>
		  <Route path="/">
		  <Route index element={<Login />} />
          <Route path="/login" element={<Login/>}/>
		  <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />}/>
		  <Route path="/profile" element={< Profile/>}/>
		  <Route path="/Members" element={<MembersPage/>}/>
		  <Route path="/Payments" element={<Payments/>}/>
		  <Route path="/Settings" element={<SettingsPage/>}/>
		  <Route path="/Notifications" element={<Notifications/>}/>

				</Route>
			</Routes>
		</HashRouter>
	);
};