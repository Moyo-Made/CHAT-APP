import React, { useContext, useState } from "react";
import {
	collection,
	query,
	where,
	serverTimestamp,
	doc,
	setDoc,
	updateDoc,
	getDoc,
	getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import Chat from "./Chat";
import { ChatContext } from "../context/ChatContext";

const Search = () => {
	const [username, setUsername] = useState("");
	const [users, setUser] = useState(null);
	const [err, setErr] = useState(false);

	const { currentUser } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);

	const handleSearch = async () => {
		const q = query(
			collection(db, "users"),
			where("displayName", "==", username)
		);

		try {
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				setUser(doc.data());
			});
		} catch (err) {
			setErr(true);
		}
	};

	const handleKey = (e) => {
		e.code === "Enter" && handleSearch();
	};
	const handleSelect = async (u) => {
		// Check whether the group (chats in Firestore) exists; if not, create it
		const combinedId =
			currentUser.uid > users.uid
				? currentUser.uid + users.uid
				: users.uid + currentUser.uid;
		try {
			const res = await getDoc(doc(db, "chats", combinedId));

			if (!res.exists()) {
				// Create a chat in the "chats" collection
				await setDoc(doc(db, "chats", combinedId), { messages: [] });

				// Create user chats
				await updateDoc(doc(db, "userChats", currentUser.uid), {
					[combinedId]: {
						userInfo: {
							uid: users.uid,
							displayName: users.displayName,
							photoURL: users.photoURL,
						},
						date: serverTimestamp(),
					},
				});

				await updateDoc(doc(db, "userChats", users.uid), {
					[combinedId]: {
						userInfo: {
							uid: currentUser.uid,
							displayName: currentUser.displayName,
							photoURL: currentUser.photoURL,
						},
						date: serverTimestamp(),
					},
				});
			}
		} catch (err) {}

		setUser(null); // Clear the user state
		setUsername(""); // Clear the input field

		dispatch({ type: "CHANGE_USER", payload: u });
	};

	return (
		<div className="search">
			<div className="searchForm">
				<input
					type="text"
					placeholder="Find a user"
					onKeyDown={handleKey}
					onChange={(e) => setUsername(e.target.value)}
					value={username}
				/>
			</div>
			{err && <span>User not found</span>}
			{users && (
				<div className="userChats" onClick={() => handleSelect(users.userInfo)}>
					<img src={users.photoURL} alt="" />
					<div className="userChatInfo">
						<span>{users.displayName}</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default Search;
