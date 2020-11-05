const fs = require('fs');
// const uid = require('uid')
const jsonLinkData = require('./linkFetched.json') || [];

const puppeteer = require('puppeteer');
const scrapurl = 'https://www.newcastle.edu.au/course/course-2016-listing';
// const scrapCourse = require('./scrapeCourse');


async function start() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(scrapurl, { waitUntil: 'domcontentloaded' });

    const self = {

        parseResult: async () => {
            try {
                let courses = await page.$$('table[class="handbook-degree-listing handbook-course-listing"]');

                for (course of courses) {
                    let courseSubject = await course.$('thead > tr')
                    let courseSubjectHeads = await courseSubject.$$eval('th', data => data.map(th => th.textContent))
                    let studyArea = courseSubjectHeads[1]

                    let courseItems = await course.$$('tbody > tr')

                    for (const courseItem of courseItems) {
                        let courseLink = await courseItem.$eval('td > a', a => a.href)
                        let courseName = await courseItem.$$eval('td > a', a => a.map(text => text.textContent))
                        console.log(courseName[1])

                        if (!jsonLinkData.includes(courseLink)) {

                            // let courseSaved = await scrapCourse.fetchCourseDetails(courseLink)
                            // if (courseSaved) {
                            //     jsonLinkData.push(courseLink)
                            //     fs.writeFile('linkFetched.json', JSON.stringify(jsonLinkData), (err) => {
                            //         if (err) {
                            //             console.log(err);
                            //         }
                            //         console.log("Course link is saved. ", courseLink);
                            //     });
                            // }

                        }
                    }
                }


            } catch (error) {
                console.log(error);
            }
        },


    }

    let start = await self.parseResult();
    // self.parseResult()
}
start()