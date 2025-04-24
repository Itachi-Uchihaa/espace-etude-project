import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Example Documents for Testing Admin APIs
 * 
 * 1. Users Collection
 * {
 *   "users": {
 *     "admin_user_id": {
 *       "email": "admin@espace-etude.com",
 *       "phone": "+1234567890",
 *       "userName": "admin",
 *       "firstName": "Admin",
 *       "lastName": "User",
 *       "password": "hashed_password",
 *       "lastLogin": Timestamp,
 *       "lastLoginHistory": [Timestamp],
 *       "lastSubscription": [
 *         {
 *           "timestamp": Timestamp,
 *           "amount": 50
 *         }
 *       ],
 *       "age": 30,
 *       "country": "Canada",
 *       "region": "Quebec",
 *       "role": "admin",
 *       "enrolledCourses": [],
 *       "registerationDate": Timestamp,
 *       "gradeLevel": "N/A",
 *       "gradeSchool": "N/A",
 *       "loginStreak": 0,
 *       "recentlyViewedCourses": []
 *     },
 *     "student_user_id": {
 *       "email": "student@example.com",
 *       "phone": "+1234567891",
 *       "userName": "student1",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "password": "hashed_password",
 *       "lastLogin": Timestamp,
 *       "lastLoginHistory": [Timestamp],
 *       "lastSubscription": [
 *         {
 *           "timestamp": Timestamp,
 *           "amount": 50
 *         },
 *         {
 *           "timestamp": Timestamp,
 *           "amount": 75
 *         }
 *       ],
 *       "age": 16,
 *       "country": "Canada",
 *       "region": "Quebec",
 *       "role": "student",
 *       "enrolledCourses": ["course_id_1"],
 *       "registerationDate": Timestamp,
 *       "gradeLevel": "Grade 10",
 *       "gradeSchool": "High School Name",
 *       "loginStreak": 5,
 *       "recentlyViewedCourses": ["course_id_1", "course_id_2"]
 *     }
 *   }
 * 
 * 2. Courses Collection
 * {
 *   "courses": {
 *     "course_id_1": {
 *       "title": "Mathematics 101",
 *       "gradeLevel": 10,
 *       "description": "Basic mathematics course for grade 10 students",
 *       "content": [
 *         {
 *           "type": "video",
 *           "title": "Introduction to Algebra",
 *           "url": "https://example.com/video1",
 *           "duration": 1200
 *         },
 *         {
 *           "type": "quiz",
 *           "title": "Algebra Quiz 1",
 *           "questions": [
 *             {
 *               "question": "What is x + 5 = 10?",
 *               "options": ["3", "5", "7", "10"],
 *               "correctAnswer": 1
 *             }
 *           ]
 *         }
 *       ],
 *       "teacherId": "teacher_id_1",
 *       "enrolledUsers": ["student_user_id"],
 *       "assignments": ["assignment_id_1"],
 *       "quizzes": ["quiz_id_1"],
 *       "noOfViews": 150,
 *       "status": "approved",
 *       "moderatedAt": Timestamp,
 *       "moderatedBy": "admin_user_id"
 *     }
 *   }
 * 
 * 3. Payments Collection
 * {
 *   "payments": {
 *     "payment_id_1": {
 *       "userId": "student_user_id",
 *       "amount": 50,
 *       "status": "paid",
 *       "paymentDate": Timestamp,
 *       "courseId": "course_id_1",
 *       "paymentMethod": "credit_card",
 *       "transactionId": "txn_123456"
 *     }
 *   }
 * 
 * 4. Assignments Collection
 * {
 *   "assignments": {
 *     "assignment_id_1": {
 *       "courseId": "course_id_1",
 *       "title": "Algebra Homework",
 *       "description": "Solve these algebraic equations",
 *       "dueDate": Timestamp,
 *       "submissions": ["submission_id_1"],
 *       "maxScore": 100,
 *       "createdAt": Timestamp
 *     }
 *   }
 * 
 * 5. Submissions Collection
 * {
 *   "submissions": {
 *     "submission_id_1": {
 *       "assignmentId": "assignment_id_1",
 *       "userId": "student_user_id",
 *       "submittedAt": Timestamp,
 *       "fileURL": "https://example.com/submission1.pdf",
 *       "grade": 85,
 *       "feedback": "Good work!",
 *       "status": "graded"
 *     }
 *   }
 * 
 * 6. Quizzes Collection
 * {
 *   "quizzes": {
 *     "quiz_id_1": {
 *       "courseId": "course_id_1",
 *       "title": "Algebra Quiz",
 *       "questions": [
 *         {
 *           "question": "What is x + 5 = 10?",
 *           "options": ["3", "5", "7", "10"],
 *           "correctAnswer": 1
 *         }
 *       ],
 *       "timeLimit": 1800,
 *       "maxScore": 100,
 *       "createdAt": Timestamp
 *     }
 *   }
 * 
 * 7. Attempted Quiz Collection
 * {
 *   "attempted_quiz": {
 *     "quiz_id_1": {
 *       "student_user_id": {
 *         "title": "Algebra Quiz",
 *         "questions": [
 *           {
 *             "question": "What is x + 5 = 10?",
 *             "selectedAnswer": 1,
 *             "isCorrect": true
 *           }
 *         ],
 *         "completedInTime": 900,
 *         "score": 100,
 *         "attemptedAt": Timestamp
 *       }
 *     }
 *   }
 * }
 */

/**
 * Project Scope Requirements:
 * 1. User Management
 *    - Admin can view all users
 *    - Admin can update user details
 *    - Admin can delete users
 *    - Admin can view user statistics
 * 
 * 2. Course Management
 *    - Admin can view all courses
 *    - Admin can update course details
 *    - Admin can delete courses
 *    - Admin can moderate course content
 * 
 * 3. Platform Analytics
 *    - Admin can view total users
 *    - Admin can view total courses
 *    - Admin can view total revenue
 *    - Admin can view active users
 * 
 * 4. Payment Management
 *    - Admin can view all payments
 *    - Admin can filter payments by date
 *    - Admin can view payment details with user information
 */

// Type definitions
interface ListRequest {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

interface Subscription {
  timestamp: admin.firestore.Timestamp;
  amount: number;
}

interface UserUpdateRequest {
  userId: string;
  userData: Partial<{
    email: string;
    phone: string;
    userName: string;
    firstName: string;
    lastName: string;
    password: string;
    lastLogin: admin.firestore.Timestamp;
    lastLoginHistory: admin.firestore.Timestamp[];
    lastSubscription: Subscription[];
    age: number;
    country: string;
    region: string;
    role: string;
    enrolledCourses: string[];
    registerationDate: admin.firestore.Timestamp;
    gradeLevel: string;
    gradeSchool: string;
    loginStreak: number;
    recentlyViewedCourses: string[];
  }>;
}

interface CourseUpdateRequest {
  courseId: string;
  courseData: Partial<admin.firestore.DocumentData>;
}

interface PaymentListRequest extends ListRequest {
  startDate?: string;
  endDate?: string;
}

interface ContentModerationRequest {
  contentId: string;
  action: 'approve' | 'reject';
  reason?: string;
}

// New interfaces for analytics
interface GeographicStats {
  region: string;
  city: string;
  studentCount: number;
}

interface UsageStats {
  date: string;
  activeUsers: number;
  courseViews: number;
}

interface GradeLevelStats {
  gradeLevel: string;
  count: number;
}

interface WeeklyReportData {
  userId: string;
  email: string;
  name: string;
  gradeLevel: string;
  lastLogin: admin.firestore.Timestamp;
  coursesEnrolled: number;
  assignmentsCompleted: number;
  averageScore: number;
}

// Middleware to check if user is admin
const isAdmin = async (request: { auth?: { uid: string } }): Promise<boolean> => {
  if (!request.auth) {
    return false;
  }

  const userDoc = await admin.firestore()
    .collection('users')
    .doc(request.auth.uid)
    .get();

  return userDoc.exists && userDoc.data()?.role === 'admin';
};

// User Management APIs
/**
 * listUsers: Satisfies User Management requirement
 * - Allows admin to view all users with pagination
 * - Supports search functionality by username
 * - Returns total count and pagination info
 */
export const listUsers = onCall<ListRequest>(async (request) => {
  await isAdmin(request);
  
  const { page = 1, limit = 10, searchTerm = '' } = request.data;
  const usersRef = admin.firestore().collection('users');
  
  let query: admin.firestore.Query = usersRef;
  
  if (searchTerm) {
    query = query.where('userName', '>=', searchTerm)
                 .where('userName', '<=', searchTerm + '\uf8ff');
  }
  
  const snapshot = await query
    .limit(limit)
    .offset((page - 1) * limit)
    .get();
    
  const users = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  const total = await query.count().get();
  
  return {
    users,
    total: total.data().count,
    page,
    totalPages: Math.ceil(total.data().count / limit)
  };
});

/**
 * updateUser: Satisfies User Management requirement
 * - Allows admin to update any user's details
 * - Validates required fields
 * - Handles subscription updates with proper typing
 */
export const updateUser = onCall<UserUpdateRequest>(async (request) => {
  await isAdmin(request);
  
  const { userId, userData } = request.data;
  
  if (!userId || !userData) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }

  // Validate subscription data if it's being updated
  if (userData.lastSubscription) {
    if (!Array.isArray(userData.lastSubscription)) {
      throw new HttpsError('invalid-argument', 'lastSubscription must be an array');
    }
    
    userData.lastSubscription.forEach((sub, index) => {
      if (!sub.timestamp || !sub.amount) {
        throw new HttpsError('invalid-argument', `Invalid subscription at index ${index}`);
      }
      if (typeof sub.amount !== 'number') {
        throw new HttpsError('invalid-argument', `Subscription amount must be a number at index ${index}`);
      }
    });
  }
  
  await admin.firestore()
    .collection('users')
    .doc(userId)
    .update(userData);
    
  return { success: true };
});

/**
 * deleteUser: Satisfies User Management requirement
 * - Allows admin to delete any user
 * - Validates user ID
 */
export const deleteUser = onCall<{ userId: string }>(async (request) => {
  await isAdmin(request);
  
  const { userId } = request.data;
  
  if (!userId) {
    throw new HttpsError('invalid-argument', 'Missing userId');
  }
  
  await admin.firestore()
    .collection('users')
    .doc(userId)
    .delete();
    
  return { success: true };
});

// Course Management APIs
/**
 * listCourses: Satisfies Course Management requirement
 * - Allows admin to view all courses with pagination
 * - Supports search functionality by title
 * - Returns total count and pagination info
 */
export const listCourses = onCall<ListRequest>(async (request) => {
  await isAdmin(request);
  
  const { page = 1, limit = 10, searchTerm = '' } = request.data;
  const coursesRef = admin.firestore().collection('courses');
  
  let query: admin.firestore.Query = coursesRef;
  
  if (searchTerm) {
    query = query.where('title', '>=', searchTerm)
                 .where('title', '<=', searchTerm + '\uf8ff');
  }
  
  const snapshot = await query
    .limit(limit)
    .offset((page - 1) * limit)
    .get();
    
  const courses = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  const total = await query.count().get();
  
  return {
    courses,
    total: total.data().count,
    page,
    totalPages: Math.ceil(total.data().count / limit)
  };
});

/**
 * updateCourse: Satisfies Course Management requirement
 * - Allows admin to update any course's details
 * - Validates required fields
 */
export const updateCourse = onCall<CourseUpdateRequest>(async (request) => {
  await isAdmin(request);
  
  const { courseId, courseData } = request.data;
  
  if (!courseId || !courseData) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }
  
  await admin.firestore()
    .collection('courses')
    .doc(courseId)
    .update(courseData);
    
  return { success: true };
});

/**
 * deleteCourse: Satisfies Course Management requirement
 * - Allows admin to delete any course
 * - Validates course ID
 */
export const deleteCourse = onCall<{ courseId: string }>(async (request) => {
  await isAdmin(request);
  
  const { courseId } = request.data;
  
  if (!courseId) {
    throw new HttpsError('invalid-argument', 'Missing courseId');
  }
  
  await admin.firestore()
    .collection('courses')
    .doc(courseId)
    .delete();
    
  return { success: true };
});

// Platform Statistics API
/**
 * getPlatformStats: Satisfies Platform Analytics requirement
 * - Returns total number of users
 * - Returns total number of courses
 * - Returns total revenue from all paid payments
 * - Returns number of active users (last 30 days)
 * - Includes timestamp for data freshness
 */
export const getPlatformStats = onCall<void>(async (request) => {
    console.log("getPlatformStats ---------------", Timestamp.now());
    console.log("getPlatformStats ======================", admin.firestore.Timestamp.now());
  await isAdmin(request);
  
  const [
    usersCount,
    coursesCount,
    totalRevenue,
    activeUsers
  ] = await Promise.all([
    admin.firestore().collection('users').count().get(),
    admin.firestore().collection('courses').count().get(),
    admin.firestore().collection('payments')
      .where('status', '==', 'paid')
      .get()
      .then(snapshot => snapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0)),
    admin.firestore().collection('users')
      .where('lastLogin', '>=', Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
      .count()
      .get()
  ]);
  
  return {
    totalUsers: usersCount.data().count,
    totalCourses: coursesCount.data().count,
    totalRevenue,
    activeUsers: activeUsers.data().count,
    timestamp: admin.firestore.Timestamp.now()
  };

});

// Payment Management API
/**
 * listPayments: Satisfies Payment Management requirement
 * - Allows admin to view all payments with pagination
 * - Supports date range filtering
 * - Returns payment details with associated user information
 * - Returns total count and pagination info
 */
export const listPayments = onCall<PaymentListRequest>(async (request) => {
  await isAdmin(request);
  
  const { page = 1, limit = 10, startDate, endDate } = request.data;
  const paymentsRef = admin.firestore().collection('payments');
  
  let query: admin.firestore.Query = paymentsRef;
  
  if (startDate) {
    query = query.where('paymentDate', '>=', admin.firestore.Timestamp.fromDate(new Date(startDate)));
  }
  
  if (endDate) {
    query = query.where('paymentDate', '<=', admin.firestore.Timestamp.fromDate(new Date(endDate)));
  }
  
  const snapshot = await query
    .orderBy('paymentDate', 'desc')
    .limit(limit)
    .offset((page - 1) * limit)
    .get();
    
  const payments = await Promise.all(snapshot.docs.map(async doc => {
    const paymentData = doc.data();
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(paymentData.userId)
      .get();
      
    return {
      id: doc.id,
      ...paymentData,
      user: userDoc.exists ? userDoc.data() : null
    };
  }));
  
  const total = await query.count().get();
  
  return {
    payments,
    total: total.data().count,
    page,
    totalPages: Math.ceil(total.data().count / limit)
  };
});

// Content Moderation API
/**
 * moderateContent: Satisfies Course Management requirement
 * - Allows admin to approve or reject course content
 * - Records moderation action with timestamp and moderator
 * - Supports rejection with reason
 * - Validates content existence and required fields
 */
export const moderateContent = onCall<ContentModerationRequest>(async (request) => {
  await isAdmin(request);
  
  const { contentId, action, reason } = request.data;
  
  if (!contentId || !action) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }
  
  const contentRef = admin.firestore()
    .collection('courses')
    .doc(contentId);
    
  const contentDoc = await contentRef.get();
  
  if (!contentDoc.exists) {
    throw new HttpsError('not-found', 'Content not found');
  }
  
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  switch (action) {
    case 'approve':
      await contentRef.update({
        status: 'approved',
        moderatedAt: admin.firestore.Timestamp.now(),
        moderatedBy: request.auth.uid
      });
      break;
      
    case 'reject':
      await contentRef.update({
        status: 'rejected',
        moderationReason: reason,
        moderatedAt: admin.firestore.Timestamp.now(),
        moderatedBy: request.auth.uid
      });
      break;
      
    default:
      throw new HttpsError('invalid-argument', 'Invalid action');
  }
  
  return { success: true };
});

/**
 * Get geographic distribution of students
 */
export const getGeographicDistribution = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!(await isAdmin(request))) {
    throw new HttpsError('permission-denied', 'User must be an admin');
  }

  const usersSnapshot = await admin.firestore().collection('users')
    .where('role', '==', 'student')
    .get();

  const stats: GeographicStats[] = [];
  const regionMap = new Map<string, number>();
  const cityMap = new Map<string, number>();

  for (const doc of usersSnapshot.docs) {
    const data = doc.data();
    if (data.region && data.city) {
      // Update region stats
      const regionCount = regionMap.get(data.region) || 0;
      regionMap.set(data.region, regionCount + 1);

      // Update city stats
      const cityCount = cityMap.get(data.city) || 0;
      cityMap.set(data.city, cityCount + 1);
    }
  }

  // Convert maps to array format
  for (const [region, count] of regionMap.entries()) {
    stats.push({ region, city: '', studentCount: count });
  }

  for (const [city, count] of cityMap.entries()) {
    stats.push({ region: '', city, studentCount: count });
  }

  return { stats };
});

/**
 * Get usage trends and statistics
 */
export const getUsageTrends = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!(await isAdmin(request))) {
    throw new HttpsError('permission-denied', 'User must be an admin');
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const usersSnapshot = await admin.firestore().collection('users')
    .where('role', '==', 'student')
    .get();

  const usageStats: UsageStats[] = [];
  const dateMap = new Map<string, { activeUsers: number; courseViews: number }>();

  for (const doc of usersSnapshot.docs) {
    const data = doc.data();
    if (data.lastLoginHistory) {
      for (const login of data.lastLoginHistory) {
        const date = login.toDate().toISOString().split('T')[0];
        const current = dateMap.get(date) || { activeUsers: 0, courseViews: 0 };
        current.activeUsers++;
        dateMap.set(date, current);
      }
    }
  }

  // Get course views
  const coursesSnapshot = await admin.firestore().collection('courses').get();
  for (const doc of coursesSnapshot.docs) {
    const data = doc.data();
    if (data.noOfViews) {
      const date = new Date().toISOString().split('T')[0];
      const current = dateMap.get(date) || { activeUsers: 0, courseViews: 0 };
      current.courseViews += data.noOfViews;
      dateMap.set(date, current);
    }
  }

  // Convert to array format
  for (const [date, stats] of dateMap.entries()) {
    usageStats.push({
      date,
      activeUsers: stats.activeUsers,
      courseViews: stats.courseViews
    });
  }

  return { usageStats };
});

/**
 * Get grade level distribution
 */
export const getGradeLevelDistribution = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!(await isAdmin(request))) {
    throw new HttpsError('permission-denied', 'User must be an admin');
  }

  const usersSnapshot = await admin.firestore().collection('users')
    .where('role', '==', 'student')
    .get();

  const gradeLevelMap = new Map<string, number>();
  const stats: GradeLevelStats[] = [];

  for (const doc of usersSnapshot.docs) {
    const data = doc.data();
    if (data.gradeLevel) {
      const count = gradeLevelMap.get(data.gradeLevel) || 0;
      gradeLevelMap.set(data.gradeLevel, count + 1);
    }
  }

  for (const [gradeLevel, count] of gradeLevelMap.entries()) {
    stats.push({ gradeLevel, count });
  }

  return { stats };
});

/**
 * Generate weekly report for a student
 */
export const generateWeeklyReport = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!(await isAdmin(request))) {
    throw new HttpsError('permission-denied', 'User must be an admin');
  }

  const { userId } = request.data;
  if (!userId) {
    throw new HttpsError('invalid-argument', 'User ID is required');
  }

  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  const userData = userDoc.data();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Get assignments completed in the last week
  const assignmentsSnapshot = await admin.firestore()
    .collection('submissions')
    .where('userId', '==', userId)
    .where('submittedAt', '>=', admin.firestore.Timestamp.fromDate(oneWeekAgo))
    .get();

  const assignmentsCompleted = assignmentsSnapshot.size;
  let totalScore = 0;
  for (const doc of assignmentsSnapshot.docs) {
    const data = doc.data();
    if (data.grade) {
      totalScore += data.grade;
    }
  }

  const averageScore = assignmentsCompleted > 0 ? totalScore / assignmentsCompleted : 0;

  const report: WeeklyReportData = {
    userId,
    email: userData?.email || '',
    name: `${userData?.firstName || ''} ${userData?.lastName || ''}`,
    gradeLevel: userData?.gradeLevel || 'N/A',
    lastLogin: userData?.lastLogin || admin.firestore.Timestamp.now(),
    coursesEnrolled: userData?.enrolledCourses?.length || 0,
    assignmentsCompleted,
    averageScore
  };

  return { report };
});

/**
 * Export student data
 */
export const exportStudentData = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  if (!(await isAdmin(request))) {
    throw new HttpsError('permission-denied', 'User must be an admin');
  }

  const { userId } = request.data;
  if (!userId) {
    throw new HttpsError('invalid-argument', 'User ID is required');
  }

  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  const userData = userDoc.data();
  
  // Get all related data
  const [assignmentsSnapshot, quizzesSnapshot, coursesSnapshot] = await Promise.all([
    admin.firestore().collection('submissions').where('userId', '==', userId).get(),
    admin.firestore().collection('attempted_quiz').where('userId', '==', userId).get(),
    admin.firestore().collection('courses').where('enrolledUsers', 'array-contains', userId).get()
  ]);

  const exportData = {
    userInfo: {
      ...userData,
      password: undefined // Remove sensitive data
    },
    assignments: assignmentsSnapshot.docs.map(doc => doc.data()),
    quizzes: quizzesSnapshot.docs.map(doc => doc.data()),
    enrolledCourses: coursesSnapshot.docs.map(doc => doc.data())
  };

  return { exportData };
}); 