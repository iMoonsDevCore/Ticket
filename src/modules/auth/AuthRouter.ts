import { Router } from "express";
import { authController } from "../auth/AuthController";
import { verifyToken } from "../middlewares/verifyToken";

const authRouter = Router();

authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.loginUser);
authRouter.post("/refresh", authController.refreshToken);
authRouter.post("/logout", verifyToken, authController.logoutUser);
authRouter.get("/mytoken", verifyToken, (req, res) => {
    res.status(200).json({ user: req.user });
});

export { authRouter };