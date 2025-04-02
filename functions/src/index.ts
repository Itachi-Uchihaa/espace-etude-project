import * as admin from 'firebase-admin';
admin.initializeApp();

// import { getUsersStats } from "./user";
import {
  listUsers,
  updateUser,
  deleteUser,
  listCourses,
  updateCourse,
  deleteCourse,
  getPlatformStats,
  listPayments,
  moderateContent
} from "./admin";


export {
//   getUsersStats,
  listUsers,
  updateUser,
  deleteUser,
  listCourses,
  updateCourse,
  deleteCourse,
  getPlatformStats,
  listPayments,
  moderateContent
};
