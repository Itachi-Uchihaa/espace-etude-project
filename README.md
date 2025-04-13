# Firebase function base url
http://127.0.0.1:5001/espace-etude/us-central1/getTotalUsers

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
- lastSubscription: [
  {
    timestamp: timestamp,
    amount: number
  }
]
- age: 16
- country: string
- region: string
- role: string
- registerationDate: timestamp
- loginStreak: number
- profiles: {
  profileId_1: {
    profileName: string
    avatar: string
    gradeLevel: string
    gradeSchool: string
    enrolledCourses: [courseId_1, courseId_2]
    recentlyViewedCourses: [courseIds] // max 10 courses
    progress: {
      courseId_1: {
        completedLessons: number
        totalLessons: number
        lastAccessed: timestamp
      }
    }
    assignments: {
      assignmentId_1: {
        status: "pending" | "submitted" | "graded"
        submissionDate: timestamp
        grade: number
      }
    }
    quizzes: {
      quizId_1: {
        attempts: number
        highestScore: number
        lastAttempt: timestamp
      }
    }
  }
}
 
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
- profileId: "profileId_1"
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
- profileId: "profileId_1"
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