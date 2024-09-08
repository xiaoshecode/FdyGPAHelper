export interface IGradeRecord {
  '学号': string;
  '姓名': string;
  '课程号': string;
  '课程名': string;
  '课序号': string;
  '专业名': string;
  '学分': string;
  '成绩': string;
  '成绩录入状态': string;
  '教学班级': string;
  '教师号': string;
  '教师名': string;
  '绩点成绩': string;
  '考试时间': string;
  '课程属性': string;
  '重修补考标志': string;
}


export interface IRankRecord {
  '年级排名(全部)': string;
  '年级排名(必限)': string;
  '班级排名(全部)': string;
  '班级排名(必限)': string;
  '学号': string;
  '姓名': string;
  '班级': string;
  '全部课程GPA': string;
  '全部课程学分': string;
  '必修限选GPA': string;
  '必修限选学分': string;
  '已修总学分数': string;
  '已修必限学分数': string;
}

export interface ISumByCourseType {
  required: number,
  all: number,
}

export interface ICourseInfo {
  grade: number,
  credit: number,
  courseType: string,
}

export interface IStudent {
  id: string,
  name: string,
  classNo: string,
  courses: ICourseInfo[],
  totalCredits: ISumByCourseType,
  gpa: ISumByCourseType,
  credits: ISumByCourseType,
  allRank: number,
  requiredRank: number,
  classAllRank: number,
  classRequiredRank: number,
}
