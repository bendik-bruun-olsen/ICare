import { NavLink } from "react-router-dom";
import { Icon } from "@equinor/eds-core-react";
import { styles } from "./NavLinks.module.css";
import {
	home,
	list,
	calendar_today,
	contacts,
	log_out,
} from "@equinor/eds-icons";

export default function NavLinks() {
	return (
		<ul className={styles.list}>
			{/* <li>
				<NavLink to="/">Home</NavLink>
			</li>
			<li>
				<NavLink to="/todo">To Do</NavLink>
			</li>
			<li>
				<NavLink to="/appointment">Appointments</NavLink>
			</li>
			<li>
				<NavLink to="/contact">Contact</NavLink>
			</li>
			<li>
				<NavLink to="/logout">Logout</NavLink>
			</li> */}
			<li>
				<Icon data={home} size={32} />
				<h3>Home</h3>
			</li>
			<li>
				<Icon data={list} size={32} />
				<h3>To Do</h3>
			</li>
			<li>
				<Icon data={calendar_today} size={32} />
				<h3>Appointments</h3>
			</li>
			<li>
				<Icon data={contacts} size={32} />
				<h3>Contact</h3>
			</li>
			<li>
				<Icon data={log_out} size={32} />
				<h3>Logout</h3>
			</li>
		</ul>
	);
}
