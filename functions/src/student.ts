import { onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// Type definitions
interface ListRequest {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

interface Profile {
  profileName: string;
  avatar: string;
  gradeLevel: string;
  gradeSchool: string;
  enrolledCourses: string[];
  recentlyViewedCourses: string[];
  progress: {
    [courseId: string]: {
      completedLessons: number;
      totalLessons: number;
      lastAccessed: admin.firestore.Timestamp;
    };
  };
  assignments: {
    [assignmentId: string]: {
      status: 'pending' | 'submitted' | 'graded';
      submissionDate: admin.firestore.Timestamp;
      grade: number;
    };
  };
  quizzes: {
    [quizId: string]: {
      attempts: number;
      highestScore: number;
      lastAttempt: admin.firestore.Timestamp;
    };
  };
}

interface CreateProfileRequest {
  profileName: string;
  avatar: string;
  gradeLevel: string;
  gradeSchool: string;
}

interface SwitchProfileRequest {
  profileId: string;
}

interface UpdateProfileRequest {
  profileId: string;
  profileData: Partial<Profile>;
}

interface CourseEnrollmentRequest {
  courseId: string;
  profileId: string;
}

interface AssignmentSubmissionRequest {
  assignmentId: string;
  profileId: string;
  fileURL: string;
}

interface QuizAttemptRequest {
  quizId: string;
  profileId: string;
  answers: {
    questionId: string;
    selectedAnswer: number;
  }[];
}

interface ProgressUpdateRequest {
  courseId: string;
  profileId: string;
  contentId: string;
  progress: number;
}

interface QuizQuestion {
  id: string;
  correctAnswer: number;
  question: string;
  options: string[];
}

interface ContentItem {
  id: string;
  progress?: number;
}

// Add these new interfaces
interface RecentlyViewedRequest {
  profileId: string;
  courseId: string;
}

interface ProfileProgressRequest {
  profileId: string;
  courseId: string;
}

// Add these new interfaces for type safety
interface AssignmentData {
  courseId: string;
  status: 'pending' | 'submitted' | 'graded';
  submissionDate: admin.firestore.Timestamp;
  grade: number;
}

interface QuizData {
  courseId: string;
  attempts: number;
  highestScore: number;
  lastAttempt: admin.firestore.Timestamp;
}

interface ProgressData {
  completedLessons: number;
  totalLessons: number;
  lastAccessed: admin.firestore.Timestamp;
}

// Middleware to check if user is student
const isStudent = async (request: { auth?: { uid: string } }) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userDoc = await admin.firestore()
    .collection('users')
    .doc(request.auth.uid)
    .get();

  if (!userDoc.exists || userDoc.data()?.role !== 'student') {
    throw new HttpsError('permission-denied', 'User must be a student');
  }
};

// Profile Management APIs
export const createProfile = onCall<CreateProfileRequest>(async (request) => {
  await isStudent(request);
  
  const { profileName, avatar, gradeLevel, gradeSchool } = request.data;
  
  if (!profileName || !gradeLevel || !gradeSchool) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }

  const userRef = admin.firestore().collection('users').doc(request.auth!.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  const userData = userDoc.data();
  const profiles = userData?.profiles || {};

  // Check if user already has 3 profiles
  if (Object.keys(profiles).length >= 3) {
    throw new HttpsError('failed-precondition', 'Maximum number of profiles reached');
  }

  const newProfileId = admin.firestore().collection('_').doc().id;
  const newProfile: Profile = {
    profileName,
    avatar,
    gradeLevel,
    gradeSchool,
    enrolledCourses: [],
    recentlyViewedCourses: [],
    progress: {},
    assignments: {},
    quizzes: {}
  };

  await userRef.update({
    [`profiles.${newProfileId}`]: newProfile
  });

  return { profileId: newProfileId };
});

export const switchProfile = onCall<SwitchProfileRequest>(async (request) => {
  await isStudent(request);
  
  const { profileId } = request.data;
  
  if (!profileId) {
    throw new HttpsError('invalid-argument', 'Missing profileId');
  }

  const userRef = admin.firestore().collection('users').doc(request.auth!.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  const userData = userDoc.data();
  const profiles = userData?.profiles || {};

  if (!profiles[profileId]) {
    throw new HttpsError('not-found', 'Profile not found');
  }

  // Update lastLogin and lastLoginHistory
  const now = admin.firestore.Timestamp.now();
  await userRef.update({
    lastLogin: now,
    lastLoginHistory: admin.firestore.FieldValue.arrayUnion(now)
  });

  return { profile: profiles[profileId] };
});

export const updateProfile = onCall<UpdateProfileRequest>(async (request) => {
  await isStudent(request);
  
  const { profileId, profileData } = request.data;
  
  if (!profileId || !profileData) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }

  const userRef = admin.firestore().collection('users').doc(request.auth!.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  const userData = userDoc.data();
  const profiles = userData?.profiles || {};

  if (!profiles[profileId]) {
    throw new HttpsError('not-found', 'Profile not found');
  }

  // Update the profile
  await userRef.update({
    [`profiles.${profileId}`]: {
      ...profiles[profileId],
      ...profileData
    }
  });

  return { success: true };
});

export const listProfiles = onCall(async (request) => {
  await isStudent(request);
  
  const userRef = admin.firestore().collection('users').doc(request.auth!.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  const userData = userDoc.data();
  const profiles = userData?.profiles || {};

  return { profiles };
});

export const deleteProfile = onCall<{ profileId: string }>(async (request) => {
  await isStudent(request);
  
  const { profileId } = request.data;
  
  if (!profileId) {
    throw new HttpsError('invalid-argument', 'Missing profileId');
  }

  const userRef = admin.firestore().collection('users').doc(request.auth!.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  const userData = userDoc.data();
  const profiles = userData?.profiles || {};

  if (!profiles[profileId]) {
    throw new HttpsError('not-found', 'Profile not found');
  }

  // Delete the profile
  await userRef.update({
    [`profiles.${profileId}`]: admin.firestore.FieldValue.delete()
  });

  return { success: true };
});

// Course Management APIs
/**
 * listAvailableCourses: Student Portal - Course Discovery
 * - Lists all available courses with pagination
 * - Supports search by title
 * - Returns course details including teacher info
 */
export const listAvailableCourses = onCall<ListRequest>(async (request) => {
  await isStudent(request);
  
  const { page = 1, limit = 10, searchTerm = '' } = request.data;
  
  const coursesRef = admin.firestore().collection('courses');
  let query: admin.firestore.Query = coursesRef;
  
  if (searchTerm) {
    query = query.where('title', '>=', searchTerm)
                 .where('title', '<=', searchTerm + '\uf8ff');
  }
  
  const [snapshot, total] = await Promise.all([
    query.limit(limit).offset((page - 1) * limit).get(),
    query.count().get()
  ]);
  
  const courses = await Promise.all(snapshot.docs.map(async doc => {
    const courseData = doc.data();
    const teacherDoc = await admin.firestore()
      .collection('users')
      .doc(courseData.teacherId)
      .get();

    return {
      id: doc.id,
      ...courseData,
      teacher: teacherDoc.exists ? teacherDoc.data() : null
    };
  }));
  
  return {
    courses,
    total: total.data().count,
    page,
    totalPages: Math.ceil(total.data().count / limit)
  };
});

export const enrollInCourse = onCall<CourseEnrollmentRequest>(async (request) => {
  await isStudent(request);
  
  const { courseId, profileId } = request.data;
  
  if (!courseId || !profileId) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }

  const userRef = admin.firestore().collection('users').doc(request.auth!.uid);
  const courseRef = admin.firestore().collection('courses').doc(courseId);

  const [userDoc, courseDoc] = await Promise.all([
    userRef.get(),
    courseRef.get()
  ]);

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  if (!courseDoc.exists) {
    throw new HttpsError('not-found', 'Course not found');
  }

  const userData = userDoc.data();
  const profiles = userData?.profiles || {};

  if (!profiles[profileId]) {
    throw new HttpsError('not-found', 'Profile not found');
  }

  // Check if already enrolled
  if (profiles[profileId].enrolledCourses.includes(courseId)) {
    throw new HttpsError('already-exists', 'Already enrolled in this course');
  }

  // Update both user and course documents
  await Promise.all([
    userRef.update({
      [`profiles.${profileId}.enrolledCourses`]: admin.firestore.FieldValue.arrayUnion(courseId)
    }),
    courseRef.update({
      enrolledUsers: admin.firestore.FieldValue.arrayUnion(request.auth!.uid)
    })
  ]);

  return { success: true };
});

// Assignment Management APIs
/**
 * listAssignments: Student Portal - Assignment List
 * - Lists all assignments for enrolled courses
 * - Includes submission status and due dates
 * - Supports filtering by course
 */
export const listAssignments = onCall<ListRequest & { courseId?: string }>(async (request) => {
  await isStudent(request);
  
  const { page = 1, limit = 10, courseId } = request.data;
  
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(request.auth.uid)
    .get();
    
  const enrolledCourses = userDoc.data()?.enrolledCourses || [];
  
  let assignmentsQuery = admin.firestore()
    .collection('assignments')
    .where('courseId', 'in', courseId ? [courseId] : enrolledCourses);
    
  const [snapshot, total] = await Promise.all([
    assignmentsQuery
      .orderBy('dueDate', 'asc')
      .limit(limit)
      .offset((page - 1) * limit)
      .get(),
    assignmentsQuery.count().get()
  ]);
  
  const assignments = await Promise.all(snapshot.docs.map(async doc => {
    const assignmentData = doc.data();
    const submissionDoc = await admin.firestore()
      .collection('submissions')
      .where('assignmentId', '==', doc.id)
      .where('userId', '==', request.auth!.uid)
      .limit(1)
      .get();
      
    return {
      id: doc.id,
      ...assignmentData,
      submission: submissionDoc.empty ? null : {
        id: submissionDoc.docs[0].id,
        ...submissionDoc.docs[0].data()
      }
    };
  }));
  
  return {
    assignments,
    total: total.data().count,
    page,
    totalPages: Math.ceil(total.data().count / limit)
  };
});

export const submitAssignment = onCall<AssignmentSubmissionRequest>(async (request) => {
  await isStudent(request);
  
  const { assignmentId, profileId, fileURL } = request.data;
  
  if (!assignmentId || !profileId || !fileURL) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }

  const userRef = admin.firestore().collection('users').doc(request.auth!.uid);
  const assignmentRef = admin.firestore().collection('assignments').doc(assignmentId);

  const [userDoc, assignmentDoc] = await Promise.all([
    userRef.get(),
    assignmentRef.get()
  ]);

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  if (!assignmentDoc.exists) {
    throw new HttpsError('not-found', 'Assignment not found');
  }

  const userData = userDoc.data();
  const profiles = userData?.profiles || {};

  if (!profiles[profileId]) {
    throw new HttpsError('not-found', 'Profile not found');
  }

  // Create submission
  const submissionRef = await admin.firestore().collection('submissions').add({
    assignmentId,
    userId: request.auth!.uid,
    profileId,
    submittedAt: admin.firestore.Timestamp.now(),
    fileURL,
    status: 'submitted'
  });

  // Update profile's assignment status
  await userRef.update({
    [`profiles.${profileId}.assignments.${assignmentId}`]: {
      status: 'submitted',
      submissionDate: admin.firestore.Timestamp.now(),
      grade: 0
    }
  });

  // Update assignment's submissions array
  await assignmentRef.update({
    submissions: admin.firestore.FieldValue.arrayUnion(submissionRef.id)
  });

  return { success: true, submissionId: submissionRef.id };
});

// Quiz Management APIs
/**
 * listQuizzes: Student Portal - Quiz List
 * - Lists all quizzes for enrolled courses
 * - Includes attempt status and scores
 * - Supports filtering by course
 */
export const listQuizzes = onCall<ListRequest & { courseId?: string }>(async (request) => {
  await isStudent(request);
  
  const { page = 1, limit = 10, courseId } = request.data;
  
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(request.auth.uid)
    .get();
    
  const enrolledCourses = userDoc.data()?.enrolledCourses || [];
  
  let quizzesQuery = admin.firestore()
    .collection('quizzes')
    .where('courseId', 'in', courseId ? [courseId] : enrolledCourses);
    
  const [snapshot, total] = await Promise.all([
    quizzesQuery
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)
      .get(),
    quizzesQuery.count().get()
  ]);
  
  const quizzes = await Promise.all(snapshot.docs.map(async doc => {
    const quizData = doc.data();
    const attemptDoc = await admin.firestore()
      .collection('attempted_quiz')
      .doc(doc.id)
      .collection('attempts')
      .doc(request.auth!.uid)
      .get();
      
    return {
      id: doc.id,
      ...quizData,
      attempt: attemptDoc.exists ? attemptDoc.data() : null
    };
  }));
  
  return {
    quizzes,
    total: total.data().count,
    page,
    totalPages: Math.ceil(total.data().count / limit)
  };
});

export const attemptQuiz = onCall<QuizAttemptRequest>(async (request) => {
  await isStudent(request);
  
  const { quizId, profileId, answers } = request.data;
  
  if (!quizId || !profileId || !answers) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }

  const userRef = admin.firestore().collection('users').doc(request.auth!.uid);
  const quizRef = admin.firestore().collection('quizzes').doc(quizId);

  const [userDoc, quizDoc] = await Promise.all([
    userRef.get(),
    quizRef.get()
  ]);

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  if (!quizDoc.exists) {
    throw new HttpsError('not-found', 'Quiz not found');
  }

  const userData = userDoc.data();
  const profiles = userData?.profiles || {};

  if (!profiles[profileId]) {
    throw new HttpsError('not-found', 'Profile not found');
  }

  // Calculate score
  const quizData = quizDoc.data();
  const questions = (quizData?.questions || []) as QuizQuestion[];
  let correctAnswers = 0;

  answers.forEach(answer => {
    const question = questions.find((q: QuizQuestion) => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.selectedAnswer) {
      correctAnswers++;
    }
  });

  const score = (correctAnswers / questions.length) * 100;

  // Record attempt
  await admin.firestore().collection('attempted_quiz').add({
    quizId,
    userId: request.auth!.uid,
    profileId,
    title: quizData?.title,
    questions: answers,
    completedInTime: Date.now() - quizData?.startTime,
    score,
    attemptedAt: admin.firestore.Timestamp.now()
  });

  // Update profile's quiz record
  const profileQuizzes = profiles[profileId].quizzes || {};
  const currentAttempts = (profileQuizzes[quizId]?.attempts || 0) + 1;
  const highestScore = Math.max(profileQuizzes[quizId]?.highestScore || 0, score);

  await userRef.update({
    [`profiles.${profileId}.quizzes.${quizId}`]: {
      attempts: currentAttempts,
      highestScore,
      lastAttempt: admin.firestore.Timestamp.now()
    }
  });

  return { success: true, score };
});

// Progress Tracking APIs
/**
 * updateProgress: Student Portal - Progress Tracking
 * - Updates student's progress in a course
 * - Records completion of content items
 * - Calculates overall course progress
 */
export const updateProgress = onCall<ProgressUpdateRequest>(async (request) => {
  await isStudent(request);
  
  const { courseId, profileId, contentId, progress } = request.data;
  
  if (!courseId || !profileId || !contentId || progress === undefined) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }

  const userRef = admin.firestore().collection('users').doc(request.auth!.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  const userData = userDoc.data();
  const profiles = userData?.profiles || {};

  if (!profiles[profileId]) {
    throw new HttpsError('not-found', 'Profile not found');
  }

  // Update progress
  await userRef.update({
    [`profiles.${profileId}.progress.${courseId}`]: {
      completedLessons: progress,
      totalLessons: 100, // This should be fetched from course data
      lastAccessed: admin.firestore.Timestamp.now()
    }
  });

  return { success: true };
});

/**
 * getProgress: Student Portal - Progress Overview
 * - Returns progress for all enrolled courses
 * - Includes detailed progress for each content item
 * - Calculates completion status
 */
export const getProgress = onCall<void>(async (request) => {
  await isStudent(request);
  
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(request.auth.uid)
    .get();
    
  const enrolledCourses = userDoc.data()?.enrolledCourses || [];
  
  const progressSnapshot = await admin.firestore()
    .collection('users')
    .doc(request.auth.uid)
    .collection('progress')
    .where(admin.firestore.FieldPath.documentId(), 'in', enrolledCourses)
    .get();
    
  const progress = await Promise.all(progressSnapshot.docs.map(async doc => {
    const courseDoc = await admin.firestore()
      .collection('courses')
      .doc(doc.id)
      .get();
      
    const courseData = courseDoc.data();
    const progressData = doc.data();
    
    return {
      courseId: doc.id,
      courseTitle: courseData?.title,
      overallProgress: progressData.overallProgress || 0,
      contentProgress: progressData,
      lastUpdated: progressData.updatedAt
    };
  }));
  
  return { progress };
});

/**
 * updateRecentlyViewed: Student Portal - Course History
 * - Updates the recently viewed courses list for a profile
 * - Maintains a maximum of 10 courses
 * - Orders by most recently viewed
 */
export const updateRecentlyViewed = onCall<RecentlyViewedRequest>(async (request) => {
  await isStudent(request);
  
  const { profileId, courseId } = request.data;
  
  if (!profileId || !courseId) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }

  const userRef = admin.firestore().collection('users').doc(request.auth!.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  const userData = userDoc.data();
  const profiles = userData?.profiles || {};

  if (!profiles[profileId]) {
    throw new HttpsError('not-found', 'Profile not found');
  }

  const recentlyViewed = profiles[profileId].recentlyViewedCourses || [];
  
  // Remove if already exists
  const filtered = recentlyViewed.filter((id: string) => id !== courseId);
  
  // Add to beginning of array
  filtered.unshift(courseId);
  
  // Keep only 10 most recent
  const updated = filtered.slice(0, 10);

  await userRef.update({
    [`profiles.${profileId}.recentlyViewedCourses`]: updated
  });

  return { success: true };
});

/**
 * getProfileProgress: Student Portal - Progress Overview
 * - Returns detailed progress for a specific profile
 * - Includes course progress, assignments, and quizzes
 */
export const getProfileProgress = onCall<ProfileProgressRequest>(async (request) => {
  await isStudent(request);
  
  const { profileId, courseId } = request.data;
  
  if (!profileId || !courseId) {
    throw new HttpsError('invalid-argument', 'Missing required fields');
  }

  const userRef = admin.firestore().collection('users').doc(request.auth!.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  const userData = userDoc.data();
  const profiles = userData?.profiles || {};

  if (!profiles[profileId]) {
    throw new HttpsError('not-found', 'Profile not found');
  }

  const profile = profiles[profileId];
  const progress = profile.progress[courseId] || {
    completedLessons: 0,
    totalLessons: 0,
    lastAccessed: null
  };

  const assignments = (Object.entries(profile.assignments || {}) as [string, AssignmentData][])
    .filter(([_, data]) => data.courseId === courseId)
    .map(([id, data]) => ({
      id,
      ...data
    }));

  const quizzes = (Object.entries(profile.quizzes || {}) as [string, QuizData][])
    .filter(([_, data]) => data.courseId === courseId)
    .map(([id, data]) => ({
      id,
      ...data
    }));

  return {
    progress,
    assignments,
    quizzes,
    recentlyViewed: profile.recentlyViewedCourses || []
  };
});

/**
 * getProfileStats: Student Portal - Profile Statistics
 * - Returns overall statistics for a profile
 * - Includes completion rates, average scores, and activity
 */
export const getProfileStats = onCall<{ profileId: string }>(async (request) => {
  await isStudent(request);
  
  const { profileId } = request.data;
  
  if (!profileId) {
    throw new HttpsError('invalid-argument', 'Missing profileId');
  }

  const userRef = admin.firestore().collection('users').doc(request.auth!.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new HttpsError('not-found', 'User not found');
  }

  const userData = userDoc.data();
  const profiles = userData?.profiles || {};

  if (!profiles[profileId]) {
    throw new HttpsError('not-found', 'Profile not found');
  }

  const profile = profiles[profileId];
  
  // Calculate course completion rates
  const enrolledCourses = profile.enrolledCourses || [];
  const completedCourses = (Object.entries(profile.progress || {}) as [string, ProgressData][])
    .filter(([_, data]) => data.completedLessons === data.totalLessons)
    .length;

  // Calculate assignment statistics
  const assignments = Object.values(profile.assignments || {}) as AssignmentData[];
  const submittedAssignments = assignments.filter(a => 
    a.status === 'submitted' || a.status === 'graded'
  );
  const gradedAssignments = assignments.filter(a => 
    a.status === 'graded'
  );
  const averageAssignmentScore = gradedAssignments.reduce(
    (sum, a) => sum + a.grade, 
    0
  ) / (gradedAssignments.length || 1);

  // Calculate quiz statistics
  const quizzes = Object.values(profile.quizzes || {}) as QuizData[];
  const totalAttempts = quizzes.reduce(
    (sum, q) => sum + q.attempts, 
    0
  );
  const averageQuizScore = quizzes.reduce(
    (sum, q) => sum + q.highestScore, 
    0
  ) / (quizzes.length || 1);

  return {
    enrolledCourses: enrolledCourses.length,
    completedCourses,
    completionRate: (completedCourses / enrolledCourses.length) * 100 || 0,
    submittedAssignments: submittedAssignments.length,
    averageAssignmentScore,
    totalQuizAttempts: totalAttempts,
    averageQuizScore,
    lastActive: profile.progress ? 
      Math.max(...(Object.values(profile.progress) as ProgressData[]).map(p => 
        p.lastAccessed?.toMillis() || 0
      )) : 0
  };
}); 