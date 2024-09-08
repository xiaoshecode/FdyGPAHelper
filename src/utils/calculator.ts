import { IGradeRecord, IRankRecord, IStudent } from "./types"

const fwNumberMapping: Record<string, string> = {
  '１': '1',
  '２': '2',
  '３': '3',
  '４': '4',
  '５': '5',
  '６': '6',
  '７': '7',
  '８': '8',
  '９': '9',
  '０': '0',
}

function floatEqual(f1: number, f2: number) {
  return Math.abs(f1 - f2) < 1e-6
}

function fullWidthConvert(fw: string): string {
  const resList: string[] = []
  for (let i = 0; i < fw.length; i++) {
    resList.push(fwNumberMapping[fw[i]] || fw[i])
  }
  return resList.join('')
}

/**
 * Calculate GPA and rank for each student
 * @param records grade records from excel
 * @returns rank records that can be written to excel
 */
export function calculateGpaAndRank(records: IGradeRecord[]): IRankRecord[] {
  const classRankMapping: Record<string, any[]> = {}
  const studentMapping: Record<string, IStudent> = {}
  console.log("records", records)
  for (let row of records) {
    const classNo = fullWidthConvert(row['教学班级'])
    const studentId = row['学号']
    const gradeAlpha = row['成绩']
    const grade = row['绩点成绩']
    const credit = row['学分']
    const courseType = row['课程属性']

    if (!classRankMapping[classNo]) {
      classRankMapping[classNo] = []
    }
    if (!studentMapping[studentId]) {
      studentMapping[studentId] = {
        id: studentId,
        name: row['姓名'],
        classNo: classNo,
        courses: [],
        totalCredits: {
          required: 0,
          all: 0,
        },
        credits: {
          required: 0,
          all: 0,
        },
        gpa: {
          required: 0,
          all: 0,
        },
        allRank: 0,
        requiredRank: 0,
        classAllRank: 0,
        classRequiredRank: 0,
      }
    }

    if (!['W', 'I', '*', 'F'].includes(gradeAlpha)) {
      if (['必修', '限选'].includes(courseType)) {
        studentMapping[studentId].totalCredits.required += parseFloat(credit)
      }
      studentMapping[studentId].totalCredits.all += parseFloat(credit)
    }

    try {
      const parsedGrade = parseFloat(grade)
      if (Number.isNaN(parsedGrade)) {
        continue
      }
      studentMapping[studentId].courses.push({
        grade: parsedGrade,
        credit: parseFloat(credit),
        courseType: courseType,
      })
    } catch (e) {
      console.log('Invalid grade:', grade)
    }
  }
  
  for (let student of Object.values(studentMapping)) {
    const courses = student.courses
    let allGpa = 0
    let requiredGpa = 0
    let allCredits = 0
    let requiredCredits = 0
    for (let course of courses) {
      if (['必修', '限选'].includes(course.courseType)) {
        requiredGpa += course.grade * course.credit
        requiredCredits += course.credit
      }
      allGpa += course.grade * course.credit
      allCredits += course.credit
    }
    student.gpa.all = allCredits > 0 ? allGpa / allCredits : 0
    student.gpa.required = requiredCredits > 0 ? requiredGpa / requiredCredits : 0
    student.credits = {
      required: requiredCredits,
      all: allCredits,
    }
  }

  // Sort students by required GPA
  const students = Object.values(studentMapping)
  students.sort((a, b) => {
    if (floatEqual(a.gpa.required, b.gpa.required)) {
      return 0
    }
    return a.gpa.required > b.gpa.required ? -1 : 1
  })

  for (let i = 0; i < students.length; i++) {
    students[i].requiredRank = i + 1
  }

  // Sort students by all GPA
  students.sort((a, b) => {
    if (floatEqual(a.gpa.all, b.gpa.all)) {
      return 0
    }
    return a.gpa.all > b.gpa.all ? -1 : 1
  })

  for (let i = 0; i < students.length; i++) {
    students[i].allRank = i + 1
  }

  for (let student of students) {
    classRankMapping[student.classNo].push(student)
  }

  // Sort students by class
  for (let student of students) {
    const classNo = student.classNo
    const classStudents = classRankMapping[classNo]

    classStudents.sort((a, b) => {
      if (floatEqual(a.gpa.all, b.gpa.all)) {
        return 0
      }
      return a.gpa.all > b.gpa.all ? -1 : 1
    })
    for (let i = 0; i < classStudents.length; i++) {
      classStudents[i].classAllRank = i + 1
    }

    classStudents.sort((a, b) => {
      if (floatEqual(a.gpa.required, b.gpa.required)) {
        return 0
      }
      return a.gpa.required > b.gpa.required ? -1 : 1
    })
    for (let i = 0; i < classStudents.length; i++) {
      classStudents[i].classRequiredRank = i + 1
    }
  }

  const result: IRankRecord[] = []
  for (let student of students) {
    result.push({
      '年级排名(全部)': student.allRank.toString(),
      '年级排名(必限)': student.requiredRank.toString(),
      '班级排名(全部)': student.classAllRank.toString(),
      '班级排名(必限)': student.classRequiredRank.toString(),
      '学号': student.id,
      '姓名': student.name,
      '班级': student.classNo,
      '全部课程GPA': student.gpa.all.toFixed(6),
      '全部课程学分': student.credits.all.toFixed(1),
      '必修限选GPA': student.gpa.required.toFixed(6),
      '必修限选学分': student.credits.required.toFixed(1),
      '已修总学分数': student.totalCredits.all.toFixed(1),
      '已修必限学分数': student.totalCredits.required.toFixed(1),
    })
  }
  console.log("results", result)
  return result
}