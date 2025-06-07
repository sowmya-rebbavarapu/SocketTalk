import express from "express";
import { protectRoute } from "../middleware/auth";
import { getMessages ,getUserForSidebar, markMessageAsSeen} from "../controllers/messageController";

const messageRouter=express.Router();
messageRoouter.get("/users",protectRoute,getUserForSidebar);
messageRoouter.get("/:id",protectRoute,getMessages);
messageRoouter.put("mark/:id",protectRoute,markMessageAsSeen);

export default messageRouter;

