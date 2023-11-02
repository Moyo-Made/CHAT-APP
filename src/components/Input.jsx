import React, { useContext } from "react";
import Attach from "../images/attachment.png";
import Image from "../images/image.png";
import { useState } from "react";
import {
	Timestamp,
	arrayUnion,
	doc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Input = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);

	const { currentUser } = useContext(AuthContext);
	const { data } = useContext(ChatContext);

	const handleSend = async () => {
		try {
			if (img) {
				const storageRef = ref(storage, uuid());
				const uploadTask = uploadBytesResumable(storageRef, img);

				// Wait for the image to be uploaded
				await uploadTask;

				const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

				// Update the Firestore document with the image URL
				await updateDoc(doc(db, "chats", data.chatId), {
					messages: arrayUnion({
						id: uuid(),
						text,
						senderId: currentUser.uid,
						date: Timestamp.now(),
						img: downloadURL,
					}),
				});
			} else {
				// Update Firestore without an image
				await updateDoc(doc(db, "chats", data.chatId), {
					messages: arrayUnion({
						id: uuid(),
						text,
						senderId: currentUser.uid,
						date: Timestamp.now(),
					}),
				});
			}
		} catch (error) {}

		await updateDoc(doc(db, "userChats", currentUser.uid), {
			[data.chatId + ".lastMessage"]: {
				text,
				date: serverTimestamp(),
			},
		});

		await updateDoc(doc(db, "userChats", data.user.uid), {
			[data.chatId + ".lastMessage"]: {
				text,
				date: serverTimestamp(),
			},
		});

		setText("");
		setImg(null);
	};

	return (
		<div className="input">
			<input
				type="text"
				placeholder="Type something..."
				onChange={(e) => setText(e.target.value)}
				value={text}
			/>
			<div className="send">
				<img src={Attach} alt="Attachment" />
				<input
					type="file"
					style={{ display: "none" }}
					id="file"
					onChange={(e) => setImg(e.target.files[0])}
				/>
				<label htmlFor="file">
					<img src={Image} alt="Add photos" />
				</label>
				<button onClick={handleSend}>Send</button>
			</div>
		</div>
	);
};

export default Input;
