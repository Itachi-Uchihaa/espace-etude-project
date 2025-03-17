# espace_etude (Firestore root)

## **users**
- userId_1 (Document)
- email: string
- phone: string
- userName: string
- firstName: string
- lastName: string
- password: password
- lastLogin: timestamp
- lastLoginHistory: [timestamp] // will save information regarding session also
- lastSubscription: timestamp
- age: 16
- country: string
- region: string
- role: string
- enrolledCourses: [courseId_1, courseId_2]
- registerationDate: timestamp
- gradeLevel: string
- gradeSchool: string
- loginStreak: number
- recentlyViewedCourses: [courseIds] **// need to confirm how many courses we can have in this category**
 
## **courses**
- courseId_1 (Document)
- title: string
- gradeLevel: number
- description: string
- content: [array of content]
- teacherId: id
- enrolledUsers: [userId_1, userId_2]
- assignments: [assignmentId_1, assignmentId_2]
- quizzes: [quizId_1, quizId_2]
- noOfViews: number
 
## **assignments**
- assignmentId_1 (Document)
- courseId: "courseId_1"
- title: "Algebra Homework"
- description: "Solve these algebraic equations."
- dueDate: timestamp
- submissions: [submissionId_1, submissionId_2]
 
## **submissions**
- submissionId_1 (Document)
- assignmentId: "assignmentId_1"
- userId: "userId_1"
- submittedAt: timestamp
- fileURL: "URL to submission file"
- grade: 85

## **quizzes**
- courseId: "courseId_1"
- quizId_1 (Document)
- title: "Algebra Quiz"
- questions: [question1, question2]
- timeLimit: number

## **attemped_quiz**
- courseId: "courseId_1"
- quizId_1 (Document)
- userId (Document)
- title: "Algebra Quiz"
- questions: [question1Attempt, question2Attempt]
- completedInTime: number
- score: number
 
## **payments**
- paymentId_1 (Document)
- userId: "userId_1"
- amount: 50
- status: "paid"
- paymentDate: timestamp