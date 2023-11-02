import React, { useContext } from "react";
import Me from "../images/me.jpg";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
	const { currentUser } = useContext(AuthContext);

	return (
		<div className="navbar">
			<span className="logo">MeetUp</span>
			<div className="users">
				<img src={currentUser.photoURL} alt="" />
				<span>{currentUser.displayName}</span>
				<button onClick={() => signOut(auth)}>logout</button>
			</div>
		</div>
	);
};

export default Navbar;
