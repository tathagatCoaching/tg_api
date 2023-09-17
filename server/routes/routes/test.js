const express = require('express');

// const models = require( '../../models/index');
// const db = require('../../config/db');

const { protect, authorize } = require('../../middleware/auth');

module.exports = (app, db) => {
  const { subject, question, topic, chapter } = db;
  app.get('/courselist', protect, function (req, res) {
    console.log(db.subject);
    console.log(subject);
    model.Course.findAll({
      include: [
        {
          model: model.Subject,
          as: 'subject',
          include: [
            {
              model: model.Topic,
              as: 'topic',
              include: [
                {
                  model: model.Chapter,
                  as: 'chapter',
                },
              ],
            },
          ],
        },
      ],
    }).then((course) => {
      console.log(course);
      const resObj = course.map((course) => {
        //tidy up the user data
        return Object.assign(
          {},
          {
            course_Id: course.courseId,
            courseName: course.courseName,
            courseDesc: course.courseDesc,
            subject: user.subject.map((subject) => {
              //tidy up the post data
              return Object.assign(
                {},
                {
                  Id: subject.Id,
                  course_Id: subject.course_id,
                  subjectName: subject.subjectName,
                  topic: subject.topic.map((topic) => {
                    //tidy up the comment data
                    return Object.assign(
                      {},
                      {
                        id: topic.id,
                        subjectId: topic.subjectId,
                        topicName: topic.topicName,
                        chapter: topic.chapter.map((chapter) => {
                          return Object.assign(
                            {},
                            {
                              chapterId: chapter.chapterId,
                              chapterName: chapter.chapterName,
                              topicId: chapter.topicId,
                            }
                          );
                        }),
                      }
                    );
                  }),
                }
              );
            }),
          }
        );
      });
      res.json(resObj);
    });
  });
};
