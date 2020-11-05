const fs = require('fs');
const puppeteer = require('puppeteer');
const jsonCourseData = require('./data.json') || [];
const courseModel = require('./courseModel');

const scrapurl = 'https://www.newcastle.edu.au/course/ARBE3301';

// module.exports.fetchCourseDetails = async (scrapurl, courseName) => {
(async () => {

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(scrapurl, { waitUntil: 'domcontentloaded' });

        let [courseIsavailable] = await page.$x('//*[@id="uon-body"]/div/div/div/div/div[1]/span/span/span')
        courseIsavailable = await courseIsavailable.getProperty('textContent')
        courseIsavailable = await courseIsavailable.jsonValue()
        console.log(courseIsavailable)

        let courseCode = "NA";
        let courseLevel = "NA";
        let courseStudyModes = [];
        let totalCreditPoints = "NA";
        let courseLink = scrapurl;
        let isAvailableOnline = false;
        let prerequisites = "NA"
        let semester = []
        let unitType ="NA"
        let description = "NA"


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
        
        
        let semestersData = await page.$$('div[class="grid-content grid-3-column"] > div[class="grid-block"]')

        semestersData.map(async (sdata) =>{
            let location = await sdata.$eval('h4', h4 => h4.textContent)
            let semesters = await sdata.$$eval('ul > li', data => data.map(li => li.textContent))
            semesters.map((smster) =>{
                let smsterTxt = smster
                let semestrYear = "NA"
                if(smster.includes('-')){
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
        })


        // if (courseInfos.length) {
        //     let cricosCode = "NA";
        //     let courseLevel = "NA";
        //     let courseStudyModes = [];
        //     let totalCreditPoints = "NA";
        //     let courseLink = scrapurl;
        //     let isAvailableOnline = false;
        //     let prerequisites = "NA"
        //     let semester = []


        //     let courseFinal = new courseModel(courseName, cricosCode, courseLevel,
        //         courseStudyModes, totalCreditPoints, courseLink, isAvailableOnline,
        //         prerequisites, semester, year)

        //     if (!jsonCourseData.includes(courseFinal)) {
        //         jsonCourseData.push(courseFinal)
        //         fs.writeFile('data.json', JSON.stringify(jsonCourseData), (err) => {
        //             if (err) {
        //                 console.log(err);
        //             }
        //             console.log("JSON data is saved. ", courseFinal);
        //         });
        //         await browser.close();
        //         return true
        //     }
        //     await browser.close();
        //     return false
        // }

    } catch (error) {
        console.log(error)
    }

})();

// }