const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;


const studentSchema = new Schema({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    pictureUrl: String,
    presentation: {
        beforeIronhack: String,
        desiredRoles: String,
        competencies: String,
        whatIndustry: String,
        funFact: String
    },
    linkedInUrl: String,
    portfolioUrl: String,

    cohort: {
        country: { type: String, required: true },
        city: { type: String, required: true },
        month: { type: String, required: true },
        year: { type: String, required: true }
    },

    projects:
        {
            projectOne:
            {
                type: Schema.Types.ObjectId,
                ref: "Project",
            },
            projectTwo:
            {
                type: Schema.Types.ObjectId,
                ref: "Project",
            },
            projectThree:
            {
                type: Schema.Types.ObjectId,
                ref: "Project",
            }
        }
}, {
    timestamps: true
});


const Student = mongoose.model( "Student", studentSchema );

module.exports = Student;