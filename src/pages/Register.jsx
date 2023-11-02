import React, { useState } from "react";
import Avatar from "../images/avater.png";
import {
	createUserWithEmailAndPassword,
	updateProfile,
	getAuth,
} from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
	const [error, setError] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const displayName = e.target[0].value;
		const email = e.target[1].value;
		const password = e.target[2].value;
		const file = e.target[3].files[0];

		try {
			const auth = getAuth();
			const res = await createUserWithEmailAndPassword(auth, email, password);

			const storageRef = ref(storage, `avatars/${displayName}`);
			const uploadTask = uploadBytesResumable(storageRef, file);

			// Wait for the upload task to complete
			await uploadTask;

			const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

			await updateProfile(res.user, {
				displayName,
				photoURL: downloadURL,
			});

			await setDoc(doc(db, "users", res.user.uid), {
				uid: res.user.uid,
				displayName,
				email,
				photoURL: downloadURL,
			});

			await setDoc(doc(db, "userChats", res.user.uid), {});
			navigate("/");
		} catch (error) {
			setError(true);
		}
	};

	return (
		<div className="form__container">
			<div className="form__wrapper">
				<span className="logo">MeetUp</span>
				<span className="title">Register</span>
				<form onSubmit={handleSubmit}>
					<input type="text" placeholder="display name" />
					<input type="email" placeholder="email" />
					<input type="password" placeholder="password" />
					<input style={{ display: "none" }} type="file" id="file" />
					<label htmlFor="file">
						<img src={Avatar} alt="" />
						<span>Add an avatar</span>
					</label>
					<button>Sign up</button>
					{error && <span>Something went wrong</span>}
				</form>
				<p>
					You do have an account?<Link to="/login">Login</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
