// gradesDatabase.js

import Dexie from 'dexie';

const db = new Dexie('GradesDatabase');
db.version(1).stores({
  grades: 'course_code,grade',
  disabledRows: 'course_code',
});

export default db;
