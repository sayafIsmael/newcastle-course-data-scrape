const fs = require('fs');
const puppeteer = require('puppeteer');
const jsonCourseData = require('./data.json') || [];
const courseModel = require('./courseModel');

const scrapurl = 'https://www.newcastle.edu.au/course/ARBE3301';

module.exports.fetchCourseDetails = async (scrapurl, courseName, year) => {
// (async () => {

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(scrapurl, { waitUntil: 'domcontentloaded' });


        let courseCode = "NA";
        let courseLevel = "NA";
        let courseStudyModes = [];
        let courseLink = scrapurl;
        let semester = []
        let unitType = "NA"
        let description = "NA"
        let campuses = []

        let studyMode = await page.$eval('div[class="contact-hours-detail"] > p', p => p.textContent).catch(e => console.log('Error: ', e.message))
        if (studyMode.includes('On Campus')) {
            let str = studyMode.split('On Campus')
            if (str[1].includes('Full Term')) {
                courseStudyModes.push({
                    studyMode: "Full-time",
                    duration: str[1].replace('Full Term', '')
                })
            } else {
                courseStudyModes.push({
                    studyMode: "NA",
                    duration: str[1].replace('Full Term', '')
                })
            }
        }


        let basicItems = await page.$$eval('div[class="fast-fact-item"] > strong', strongItms => strongItms.map(strong => strong.textContent)).catch(e => console.log('Error: ', e.message))
        let basicItemsData = await page.$$eval('div[class="fast-fact-item"] > p', paragItms => paragItms.map(p => p.textContent)).catch(e => console.log('Error: ', e.message))

        basicItems.map((item, i) => {
            switch (item) {
                case "Course code":
                    courseCode = basicItemsData[i]
                    break;
                case "Units":
                    unitType = `Common Units (${basicItemsData[i]})`
                    break;
                case "Level":
                    courseLevel = basicItemsData[i]
                    break;
                // case y:
                //     // code block
                //     break;
                default:
                // code block
            }
        })

        let [cDescription] = await page.$x('//*[@id="course-details"]/p[1]')
        description = await cDescription.getProperty('textContent')
        description = await description.jsonValue()


        let semestersData = await page.$$('div[class="grid-content grid-3-column"] > div[class="grid-block"]').catch(e => console.log('Error semester data: ', e.message))

        if (semestersData.length) {
            for (sdata of semestersData){
                let location = await sdata.$eval('h4', h4 => h4.textContent).catch(e => console.log('Error location: ', e.message))
                let semesters = await sdata.$$eval('ul > li', data => data.map(li => li.textContent)).catch(e => console.log('Error semester: ', e.message))

                semesters.map(async (smster) => {
                    let smsterTxt = smster
                    let semestrYear = "NA"
                    if (smster.includes('-')) {
                        let smsterData = smster.split('-')
                        semestrYear = smsterData[1]
                        smsterTxt = smsterData[0]
                    }
                    semester.push(
                        {
                            year: semestrYear,
                            semester: smsterTxt,
                            attendanceMode: "Internal",
                            location,
                            learningMethod: "NA"
                        }
                    )
                })
                campuses.push({
                    type: "Offline",
                    campusName: location,
                    postalAddress: null,
                    state: null,
                    geolocation: {
                        lat: null,
                        lan: null
                    }
                })
            }
        }
        // console.log(semester)

        let courseFinal = new courseModel(courseName, courseCode, courseLevel,
        courseStudyModes, totalCreditPoints = "NA", courseLink, isAvailableOnline = {},
        prerequisites = "NA", semester, year, unitType,  description, campuses)

        if (!jsonCourseData.includes(courseFinal)) {
            jsonCourseData.push(courseFinal)
            fs.writeFile('data.json', JSON.stringify(jsonCourseData), (err) => {
                if (err) {
                    console.log(err);
                }
                console.log("JSON data is saved. ", courseFinal);
            });
            await browser.close();
            return true
        }
        await browser.close();
        return false

    } catch (error) {
        console.log(error)
    }

// })();

}