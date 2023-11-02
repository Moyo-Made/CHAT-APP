import React, { useContext } from "react";
import Add from "../images/add-user.png";
import Cam from "../images/video-camera.png";
import More from "../images/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
	const { data } = useContext(ChatContext);
	return (
		<div className="chats">
			<div className="chatInfo">
				<span>{data.user?.displayName}</span>
				<div className="chatIcon">
					<img src={Cam} alt="" />
					<img src={Add} alt="" />
					<img src={More} alt="" />
				</div>
			</div>
			<Messages />
			<Input />
		</div>
	);
};

export default Chat;
