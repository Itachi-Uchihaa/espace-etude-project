# Profile Management Documentation

## Overview
Each user can have up to 3 profiles, similar to Netflix's profile system. Each profile maintains its own:
- Course enrollments
- Progress tracking
- Assignment submissions
- Quiz attempts
- Recently viewed courses

## API Endpoints

### 1. Create Profile
```typescript
createProfile(profileName: string, avatar: string, gradeLevel: string, gradeSchool: string)
```
- Creates a new profile for the user
- Maximum 3 profiles per user
- Returns the new profile ID

### 2. Switch Profile
```typescript
switchProfile(profileId: string)
```
- Switches to a different profile
- Updates lastLogin and lastLoginHistory
- Returns the profile data

### 3. Update Profile
```typescript
updateProfile(profileId: string, profileData: Partial<Profile>)
```
- Updates profile information
- Can update any profile field
- Returns success status

### 4. List Profiles
```typescript
listProfiles()
```
- Lists all profiles for the user
- Returns profile data for all profiles

### 5. Delete Profile
```typescript
deleteProfile(profileId: string)
```
- Deletes a profile
- Removes all profile-specific data
- Returns success status

## Profile Data Structure
```typescript
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
      lastAccessed: Timestamp;
    };
  };
  assignments: {
    [assignmentId: string]: {
      status: 'pending' | 'submitted' | 'graded';
      submissionDate: Timestamp;
      grade: number;
    };
  };
  quizzes: {
    [quizId: string]: {
      attempts: number;
      highestScore: number;
      lastAttempt: Timestamp;
    };
  };
}
```

## Example Usage

### Creating a Profile
```typescript
const result = await createProfile({
  profileName: "Math Student",
  avatar: "math_avatar.png",
  gradeLevel: "Grade 10",
  gradeSchool: "High School"
});
const profileId = result.profileId;
```

### Switching Profiles
```typescript
const result = await switchProfile(profileId);
const profileData = result.profile;
```

### Updating Profile
```typescript
await updateProfile(profileId, {
  gradeLevel: "Grade 11",
  avatar: "new_avatar.png"
});
```

### Listing Profiles
```typescript
const result = await listProfiles();
const profiles = result.profiles;
```

### Deleting a Profile
```typescript
await deleteProfile(profileId);
```

## Best Practices
1. Always check if a profile exists before performing operations
2. Use the profileId in all course-related operations
3. Keep recentlyViewedCourses list to a maximum of 10 courses
4. Update lastAccessed timestamp when accessing course content
5. Maintain separate progress tracking for each profile
6. Handle profile-specific assignments and quizzes separately

## Error Handling
- Profile not found
- Maximum profiles reached (3)
- Invalid profile data
- Unauthorized access
- Profile deletion restrictions 