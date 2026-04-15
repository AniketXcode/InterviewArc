import express from "express"
import isAuth from "../middlewares/isAuth.js"
import isAdmin from "../middlewares/isAdmin.js"
import { addDevTestCoins, claimMerchReward, createDevRewardOrder, enableDevAdminAccess, getAdminRewardOrders, getCurrentUser, getLeaderboard, getMyRewardOrders, getRewardsOverview, getStoreCatalog, purchaseStoreItem, updateRewardOrderStatus } from "../controllers/user.controller.js"


const userRouter = express.Router()

userRouter.get("/current-user",isAuth,getCurrentUser)
userRouter.get("/rewards",isAuth,getRewardsOverview)
userRouter.get("/leaderboard",isAuth,getLeaderboard)
userRouter.get("/store",isAuth,getStoreCatalog)
userRouter.post("/store/purchase",isAuth,purchaseStoreItem)
userRouter.post("/store/claim-order",isAuth,claimMerchReward)
userRouter.get("/store/orders",isAuth,getMyRewardOrders)
userRouter.get("/admin/reward-orders",isAuth,isAdmin,getAdminRewardOrders)
userRouter.patch("/admin/reward-orders/:orderId",isAuth,isAdmin,updateRewardOrderStatus)
userRouter.post("/dev/add-test-coins",isAuth,addDevTestCoins)
userRouter.post("/dev/enable-admin",isAuth,enableDevAdminAccess)
userRouter.post("/dev/create-demo-order",isAuth,createDevRewardOrder)

export default userRouter
