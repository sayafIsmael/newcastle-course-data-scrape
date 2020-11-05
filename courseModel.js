var UniqueNumber = require("unique-number");
var uniqueNumber = new UniqueNumber(true);

const model = function (courseName = "NA", courseCode="NA", courseLevel = "NA",
    courseStudyModes = [], totalCreditPoints = "NA", courseLink = "NA", isAvailableOnline = {},
    prerequisites = "NA", semester, year = "NA", unitType = "NA",  description="NA", campuses = []) {
    this.courseId = "newcastle-" + uniqueNumber.generate()
    this.courseName = courseName
    this.courseCode = courseCode
    this.cricosCode = "00109J"
    this.studyArea = "NA"
    this.courseLevel = courseLevel
    this.courseStudyModes = courseStudyModes
    this.totalCreditPoints = totalCreditPoints
    this.courseUnits = [
        {
            unitType,
            creditPoints: totalCreditPoints,
            description,
            unitList: [
                {
                    code: "NA",
                    title: "NA",
                    year,
                    hours: null,
                    creditPoints: "NA",
                    semester,
                    sector: courseLevel,
                    discipline: "NA",
                    prerequisites,
                    incompatible: "NA",
                    assumedKnowledge: "NA",
                    description
                }
            ]
        },
    ]
    this.isAvailableOnline = isAvailableOnline
    this.campuses = campuses
    this.courseFees = []
    this.institutionSpecificData = {}
    this.courseLink = courseLink
}

module.exports = model;
