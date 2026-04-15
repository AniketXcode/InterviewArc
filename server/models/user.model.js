import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    credits:{
        type:Number,
        default:100
    },
    subscription: {
        tier: {
            type: String,
            enum: ["FREE", "PRO"],
            default: "FREE"
        },
        expiresAt: {
            type: Date
        }
    },
    quotas: {
        resumeParses: {
            type: Number,
            default: 1
        },
        mockInterviews: {
            type: Number,
            default: 2
        },
        lastResetDate: {
            type: Date,
            default: Date.now
        }
    },
    streak: {
        current: { type: Number, default: 0 },
        lastInterviewDate: { type: Date, default: null }
    },
    coins: {
        type: Number,
        default: 120
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    badges: [{
        key: String,
        label: String,
        description: String,
        earnedAt: Date
    }],
    rewardStats: {
        interviewsCompleted: {
            type: Number,
            default: 0
        },
        highestScore: {
            type: Number,
            default: 0
        },
        totalCoinsEarned: {
            type: Number,
            default: 0
        }
    },
    rewardInventory: {
        premiumReportAccess: {
            type: Boolean,
            default: false
        },
        rolePacks: {
            type: [String],
            default: []
        },
        companyPacks: {
            type: [String],
            default: []
        },
        merchClaims: {
            type: [String],
            default: []
        },
        themes: {
            type: [String],
            default: []
        },
        consumables: {
            premiumReportPasses: {
                type: Number,
                default: 0
            },
            mockInterviewTickets: {
                type: Number,
                default: 0
            },
            retryTickets: {
                type: Number,
                default: 0
            },
            resumeReviewCredits: {
                type: Number,
                default: 0
            },
            streakShields: {
                type: Number,
                default: 0
            }
        }
    },
    storeHistory: [{
        itemId: String,
        title: String,
        category: String,
        coinCost: Number,
        productType: String,
        purchasedAt: {
            type: Date,
            default: Date.now
        }
    }],
    preferredShippingAddress: {
        fullName: { type: String, default: "" },
        phone: { type: String, default: "" },
        addressLine1: { type: String, default: "" },
        addressLine2: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        country: { type: String, default: "India" }
    }

}, {timestamps:true})

const User = mongoose.model("User" , userSchema)

export default User
