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

export default function NavLinks({ onNavClick }: { onNavClick?: () => void }) {
	return (
		<ul className={styles.list}>
			<li>
				<NavLink to={Paths.HOME} onClick={onNavClick}>
					<Icon data={home} size={32} />
					<p>Home</p>
				</NavLink>
			</li>
			<li>
				<NavLink to={Paths.TODO} onClick={onNavClick}>
					<Icon data={list} size={32} />
					<p>To Do</p>
				</NavLink>
			</li>
			<li>
				<NavLink to={Paths.APPOINTMENT} onClick={onNavClick}>
					<Icon data={calendar_today} size={32} />
					<p>Appointments</p>
				</NavLink>
			</li>
			<li>
				<NavLink to={Paths.CONTACT} onClick={onNavClick}>
					<Icon data={contacts} size={32} />
					<p>Contact</p>
				</NavLink>
			</li>
			<li>
				<NavLink to={Paths.LOGIN} onClick={onNavClick}>
					<Icon data={log_out} size={32} />
					<p>Logout</p>
				</NavLink>
			</li>
		</ul>
	);
}
