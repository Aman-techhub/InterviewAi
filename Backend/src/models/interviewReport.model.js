const mongoose = require("mongoose");


/**
 * -jon description Schema : String
 * -resume text : String
 * Self description : String
 * 
 * -matchScore: Number
 * 
 * -Technical questions : 
 *          [{
 *            question: " ",
 *           intention: " ",
 *          answer: " ",
 *          }]
 * -Behavioral questions : [
 *          {
 *            question: " ",
 *           intention: " ",
 *          answer: " ",
 *          }
 * ]
 * -Skill gaps:[
 *         {
 *            skill: " ",
 *           severity: {
 *        type: String,
 *       enum: ["low", "medium", "high"],
 *  }
 * ]
 * -preparation plan : [{
 *          day: Number,
 *          focus: String,
 *          task: [String]
 * }]
 * 
 */
const technicalQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Question is required"],
        },

        intention: {
            type: String,
            required: [true, "Intention is required"],
        },

        answer: {
            type: String,
            required: [true, "Answer is required"],
        },
    },
    {
        _id: false,
    }
);


/*
 * Behavioral Question Schema
 */
const behavioralQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Question is required"],
        },

        intention: {
            type: String,
            required: [true, "Intention is required"],
        },

        answer: {
            type: String,
            required: [true, "Answer is required"],
        },
    },
    {
        _id: false,
    }
);


/*
 * Skill Gap Schema
 */
const skillGapSchema = new mongoose.Schema(
    {
        skill: {
            type: String,
            required: [true, "Skill is required"],
        },

        severity: {
            type: String,

            enum: ["low", "medium", "high"],

            required: [true, "Severity is required"],
        },
    },
    {
        _id: false,
    }
);


/*
 * Preparation Plan Schema
 */
const preparationPlanSchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: [true, "Day is required"],
        },

        focus: {
            type: String,
            required: [true, "Focus is required"],
        },

        tasks: [
            {
                type: String,
                required: [true, "Task is required"],
            },
        ],
    },
    {
        _id: false,
    }
);


/*
 * Interview Report Schema
 */
const interviewReportSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
        },

        jobDescription: {
            type: String,
            required: [true, "Job Description is required"],
        },

        resume: {
            type: String,
        },

        selfDescription: {
            type: String,
            required: [true, "Self Description is required"],
        },

        durationDays: {
            type: Number,
            min: 1,
            max: 365,
        },

        matchScore: {
            type: Number,
            min: 0,
            max: 100,
        },

        technicalQuestions: [
            technicalQuestionSchema
        ],

        behavioralQuestions: [
            behavioralQuestionSchema
        ],

        skillGaps: [
            skillGapSchema
        ],

        preparationPlan: [
            preparationPlanSchema
        ],

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);


const interviewReportModel = mongoose.model(
    "InterviewReport",
    interviewReportSchema
);


module.exports = interviewReportModel;