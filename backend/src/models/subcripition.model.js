import mongoose,{ Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export const subscriptionModel = mongoose.model("Subscripiton", subscriptionSchema)