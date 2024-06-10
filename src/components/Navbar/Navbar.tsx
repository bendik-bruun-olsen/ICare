import { NavLink } from "react-router-dom";
import style from "./Navbar.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { Icon } from "@equinor/eds-core-react";
import { menu, close } from "@equinor/eds-icons";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const updateMedia = () => {
		setIsMobile(window.innerWidth <= 768);
	};

	useEffect(() => {
		window.addEventListener("resize", updateMedia);
		return () => window.removeEventListener("resize", updateMedia);
	}, []);

	return (
		<nav className={style.navbar}>
			<div className={style.logo}>iCare</div>

			{isMobile && (
				<>
					<h2>Menu</h2>
					<div className={style.hamburger} onClick={toggleMenu}>
						<Icon data={isOpen ? close : menu} size={48} />
					</div>

					{isOpen && (
						<ul>
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

							{/* Using temporary h3 until routing is fixed */}

							<li>
								<h3>Home</h3>
							</li>
							<li>
								<h3>To Do</h3>
							</li>
							<li>
								<h3>Appointments</h3>
							</li>
							<li>
								<h3>Contact</h3>
							</li>
							<li>
								<h3>Logout</h3>
							</li>
						</ul>
					)}
				</>
			)}
		</nav>
	);
}
