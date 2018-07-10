const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;


const projectSchema = new Schema({
    creators: [
        {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true
        }
    ],
    name: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    description: { type: String, required: true },
    gitHubUrl: [String],
    websiteUrl: [String],
    podiumPosition: { type: Number, default: 0 }
}, {
    timestamps: true
});


const Project = mongoose.model( "Project", projectSchema );

module.exports = Project;