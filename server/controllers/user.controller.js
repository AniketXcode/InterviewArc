import User from "../models/user.model.js"
import RewardOrder from "../models/rewardOrder.model.js"
import { applyStorePurchase, buildRewardsOverview, buildStoreCatalogForUser, getLevelFromXp, getStoreCatalogItemById, isPhysicalReward, normalizeRewardInventory } from "../utils/rewards.js"
import Interview from "../models/interview.model.js"
import { sendRewardClaimAdminEmail } from "../utils/sendEmail.js"

const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

const getAdminFlag = (user) =>
    Boolean(user && ((user.role === "ADMIN") || adminEmails.includes((user.email || "").toLowerCase())))

const sanitizeAddress = (address = {}) => ({
    fullName: (address.fullName || "").trim(),
    phone: (address.phone || "").trim(),
    addressLine1: (address.addressLine1 || "").trim(),
    addressLine2: (address.addressLine2 || "").trim(),
    city: (address.city || "").trim(),
    state: (address.state || "").trim(),
    postalCode: (address.postalCode || "").trim(),
    country: (address.country || "India").trim()
})

const validateAddress = (address) => {
    const requiredFields = ["fullName", "phone", "addressLine1", "city", "state", "postalCode", "country"]
    const missingField = requiredFields.find((field) => !address[field])
    return missingField || ""
}

const buildUserPayload = (user) => ({
    ...user.toObject(),
    rewardInventory: normalizeRewardInventory(user.rewardInventory),
    level: getLevelFromXp(user.xp || 0),
    isAdmin: getAdminFlag(user)
})

const createOrderNumber = () =>
    `IARC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

const isDevToolsEnabled = () =>
    process.env.DEV_TEST_TOOLS_ENABLED === "true"

const ensureDevToolsEnabled = (res) => {
    if (isDevToolsEnabled()) {
        return true
    }

    res.status(403).json({ message: "Dev test tools are disabled." })
    return false
}

const queueRewardClaimAdminEmail = ({ user, item, order = null, shippingAddress = null }) => {
    sendRewardClaimAdminEmail({ user, item, order, shippingAddress }).catch((error) => {
        console.error("Reward claim admin email failed:", error)
    })
}

export const getCurrentUser = async (req,res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).lean()
        if(!user) {
            return res.status(404).json({message:"user does not found"})
        }
        return res.status(200).json({
            ...user,
            rewardInventory: normalizeRewardInventory(user.rewardInventory),
            level: getLevelFromXp(user.xp || 0),
            isAdmin: getAdminFlag(user)
        })
    } catch (error) {
         return res.status(500).json({message:`failed to get currentUser ${error}`})
    }
}

export const getRewardsOverview = async (req, res) => {
    try {
        const [user, completedInterviews, highestScoreInterview] = await Promise.all([
            User.findById(req.userId).lean(),
            Interview.countDocuments({ userId: req.userId, status: "completed" }),
            Interview.findOne({ userId: req.userId, status: "completed" })
                .sort({ finalScore: -1 })
                .select("finalScore")
                .lean()
        ])

        if (!user) {
            return res.status(404).json({ message: "user does not found" })
        }

        return res.status(200).json(buildRewardsOverview({
            user,
            completedInterviews,
            highestScore: highestScoreInterview?.finalScore || 0
        }))
    } catch (error) {
        return res.status(500).json({ message: `failed to load rewards overview ${error}` })
    }
}

export const getStoreCatalog = async (req, res) => {
    try {
        const user = await User.findById(req.userId).lean()

        if (!user) {
            return res.status(404).json({ message: "user does not found" })
        }

        return res.status(200).json({
            coins: user.coins || 0,
            items: buildStoreCatalogForUser(user)
        })
    } catch (error) {
        return res.status(500).json({ message: `failed to load store ${error}` })
    }
}

export const purchaseStoreItem = async (req, res) => {
    try {
        const { itemId } = req.body
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({ message: "user does not found" })
        }

        const purchaseResult = applyStorePurchase({ user, itemId })

        if (purchaseResult.error) {
            return res.status(400).json({ message: purchaseResult.error })
        }

        await user.save()
        queueRewardClaimAdminEmail({
            user,
            item: purchaseResult.item
        })

        const successMessage = purchaseResult.item.productType === "consumable"
            ? `${purchaseResult.item.title} redeemed and added to your inventory.`
            : purchaseResult.item.productType === "subscription"
                ? `${purchaseResult.item.title} redeemed successfully.`
                : `${purchaseResult.item.title} unlocked successfully.`

        return res.status(200).json({
            message: successMessage,
            item: purchaseResult.item,
            user: buildUserPayload(user),
            items: buildStoreCatalogForUser(user)
        })
    } catch (error) {
        return res.status(500).json({ message: `failed to purchase store item ${error}` })
    }
}

export const claimMerchReward = async (req, res) => {
    try {
        const { itemId, shippingAddress } = req.body
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({ message: "user does not found" })
        }

        const catalogItem = getStoreCatalogItemById(itemId)

        if (!catalogItem) {
            return res.status(404).json({ message: "Store item not found." })
        }

        if (!isPhysicalReward(catalogItem)) {
            return res.status(400).json({ message: "This item does not require order checkout." })
        }

        const address = sanitizeAddress(shippingAddress)
        const missingField = validateAddress(address)

        if (missingField) {
            return res.status(400).json({ message: `Please fill ${missingField}.` })
        }

        const purchaseResult = applyStorePurchase({ user, itemId })

        if (purchaseResult.error) {
            return res.status(400).json({ message: purchaseResult.error })
        }

        user.preferredShippingAddress = address
        await user.save()

        const order = await RewardOrder.create({
            orderNumber: createOrderNumber(),
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            itemId: catalogItem.id,
            title: catalogItem.title,
            category: catalogItem.category,
            coinCost: catalogItem.coinCost,
            shippingAddress: address,
            statusHistory: [
                {
                    status: "placed",
                    note: "Order placed from rewards store checkout."
                }
            ]
        })

        queueRewardClaimAdminEmail({
            user,
            item: catalogItem,
            order,
            shippingAddress: address
        })

        return res.status(200).json({
            message: `${catalogItem.title} order placed successfully.`,
            order,
            item: catalogItem,
            user: buildUserPayload(user),
            items: buildStoreCatalogForUser(user)
        })
    } catch (error) {
        return res.status(500).json({ message: `failed to claim merch reward ${error}` })
    }
}

export const getMyRewardOrders = async (req, res) => {
    try {
        const orders = await RewardOrder.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .lean()

        return res.status(200).json({ orders })
    } catch (error) {
        return res.status(500).json({ message: `failed to load reward orders ${error}` })
    }
}

export const getAdminRewardOrders = async (req, res) => {
    try {
        const orders = await RewardOrder.find({})
            .sort({ createdAt: -1 })
            .lean()

        return res.status(200).json({ orders })
    } catch (error) {
        return res.status(500).json({ message: `failed to load admin reward orders ${error}` })
    }
}

export const updateRewardOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status, adminNotes = "" } = req.body
        const validStatuses = ["placed", "confirmed", "packed", "shipped", "delivered", "cancelled"]

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status." })
        }

        const order = await RewardOrder.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found." })
        }

        order.status = status
        order.adminNotes = (adminNotes || "").trim()
        order.statusHistory.push({
            status,
            note: order.adminNotes || `Order marked as ${status}.`
        })

        await order.save()

        return res.status(200).json({
            message: `Order updated to ${status}.`,
            order
        })
    } catch (error) {
        return res.status(500).json({ message: `failed to update reward order ${error}` })
    }
}

export const addDevTestCoins = async (req, res) => {
    try {
        if (!ensureDevToolsEnabled(res)) {
            return
        }

        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({ message: "user does not found" })
        }

        user.coins = (user.coins || 0) + 20000
        await user.save()

        return res.status(200).json({
            message: "20,000 test coins added.",
            user: buildUserPayload(user)
        })
    } catch (error) {
        return res.status(500).json({ message: `failed to add dev test coins ${error}` })
    }
}

export const enableDevAdminAccess = async (req, res) => {
    try {
        if (!ensureDevToolsEnabled(res)) {
            return
        }

        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({ message: "user does not found" })
        }

        user.role = "ADMIN"
        await user.save()

        return res.status(200).json({
            message: "Admin access enabled for this account.",
            user: buildUserPayload(user)
        })
    } catch (error) {
        return res.status(500).json({ message: `failed to enable dev admin access ${error}` })
    }
}

export const createDevRewardOrder = async (req, res) => {
    try {
        if (!ensureDevToolsEnabled(res)) {
            return
        }

        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({ message: "user does not found" })
        }

        const existingAddress = sanitizeAddress(user.preferredShippingAddress || {})
        const shippingAddress = {
            fullName: existingAddress.fullName || user.name || "Demo User",
            phone: existingAddress.phone || "9999999999",
            addressLine1: existingAddress.addressLine1 || "221 Demo Street",
            addressLine2: existingAddress.addressLine2 || "Near Rewards Hub",
            city: existingAddress.city || "Jaipur",
            state: existingAddress.state || "Rajasthan",
            postalCode: existingAddress.postalCode || "302001",
            country: existingAddress.country || "India"
        }

        user.preferredShippingAddress = shippingAddress
        await user.save()

        const order = await RewardOrder.create({
            orderNumber: createOrderNumber(),
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            itemId: "dev-demo-merch-order",
            title: "Demo Merch Reward Order",
            category: "Merch Rewards",
            coinCost: 0,
            shippingAddress,
            statusHistory: [
                {
                    status: "placed",
                    note: "Demo reward order created from dev test tools."
                }
            ]
        })

        return res.status(200).json({
            message: `Demo order created. Order #${order.orderNumber}`,
            order,
            user: buildUserPayload(user)
        })
    } catch (error) {
        return res.status(500).json({ message: `failed to create dev reward order ${error}` })
    }
}

export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({})
            .select("name coins xp level streak rewardStats")
            .lean()

        const rankedUsers = users
            .map((user) => ({
                id: user._id,
                name: user.name,
                coins: user.coins || 0,
                xp: user.xp || 0,
                level: getLevelFromXp(user.xp || 0),
                streak: user.streak?.current || 0,
                interviewsCompleted: user.rewardStats?.interviewsCompleted || 0
            }))
            .sort((a, b) => {
                if (b.xp !== a.xp) return b.xp - a.xp
                if (b.coins !== a.coins) return b.coins - a.coins
                return b.streak - a.streak
            })
            .map((user, index) => ({
                ...user,
                rank: index + 1
            }))

        const topUsers = rankedUsers.slice(0, 10)
        const currentUser = rankedUsers.find((user) => String(user.id) === String(req.userId)) || null

        return res.status(200).json({
            topUsers,
            currentUser
        })
    } catch (error) {
        return res.status(500).json({ message: `failed to load leaderboard ${error}` })
    }
}
