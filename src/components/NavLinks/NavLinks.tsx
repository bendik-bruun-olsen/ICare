import { NavLink } from "react-router-dom";
import { Icon } from "@equinor/eds-core-react";
import styles from "./NavLinks.module.css";
import {
	home,
	list,
	calendar_today,
	contacts,
	log_out,
} from "@equinor/eds-icons";
import { Paths } from "../../utils/paths";

export default function NavLinks() {
	return (
		<ul className={styles.list}>
			<li>
				<Icon data={home} size={32} />
				<NavLink to={Paths.HOME}>Home</NavLink>
			</li>
			<li>
				<Icon data={list} size={32} />
				<NavLink to={Paths.TODO}>To Do</NavLink>
			</li>
			<li>
				<Icon data={calendar_today} size={32} />
				<NavLink to={Paths.APPOINTMENT}>Appointments</NavLink>
			</li>
			<li>
				<Icon data={contacts} size={32} />
				<NavLink to={Paths.CONTACT}>Contact</NavLink>
			</li>
			<li>
				<Icon data={log_out} size={32} />
				<NavLink to={Paths.LOGIN}>Logout</NavLink>
			</li>
		</ul>
	);
}
