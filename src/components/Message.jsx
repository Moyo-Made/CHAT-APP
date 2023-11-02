import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
	const { currentUser } = useContext(AuthContext);
	const { data } = useContext(ChatContext);

	const ref = useRef();

	useEffect(() => {
		ref.current?.scrollIntoView({ behavior: "smooth" });
	}, [message]);

	// Check if the message was sent by the current user
	const isCurrentUserMessage = message.senderId === currentUser.uid;

	return (
		<div
			ref={ref}
			className={`message ${isCurrentUserMessage ? "owner" : "other"}`}
		>
			<div className="messageInfo">
				<img
					src={
						message.senderId === currentUser.uid
							? currentUser.photoURL
							: data.user.photoURL
					}
					alt=""
				/>
				<span>Just now</span>
			</div>
			<div className="messageContent">
				<p>{message.text}</p>
				{message.img && <img src={message.img} alt="" />}
			</div>
		</div>
	);
};

export default Message;
