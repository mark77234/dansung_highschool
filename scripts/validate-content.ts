import { access, readdir } from 'node:fs/promises'
import path from 'node:path'
import { classStudents, classes, photos, projects, schedule, type PublishedClassId } from '../src/data/archive.ts'
import { classCommentaries, studentComments } from '../src/data/comments.ts'

const root = process.cwd()
const failures: string[] = []
const publishedClasses = classes.filter((item) => item.status === 'published')
const photoIds = new Set<string>()
const sourceKeys = new Set<string>()

if (photos.length !== 48) failures.push(`등록 사진 수가 48장이 아닙니다: ${photos.length}`)

for (const photo of photos) {
  if (photoIds.has(photo.id)) failures.push(`중복 사진 ID: ${photo.id}`)
  photoIds.add(photo.id)
  const sourceKey = `${photo.classId}/${photo.source.normalize('NFC')}`
  if (sourceKeys.has(sourceKey)) failures.push(`중복 원본 파일: ${sourceKey}`)
  sourceKeys.add(sourceKey)
  try {
    await access(path.join(root, 'res', photo.classId, photo.source))
  } catch {
    failures.push(`원본 파일 없음: ${photo.classId}/${photo.source}`)
  }
}

for (const classRecord of publishedClasses) {
  if (!classRecord.heroPhotoId || !photoIds.has(classRecord.heroPhotoId)) {
    failures.push(`${classRecord.id} 대표 사진이 잘못됐습니다.`)
  }
  const files = (await readdir(path.join(root, 'res', classRecord.id)))
    .filter((name) => /\.(png|jpe?g)$/i.test(name))
    .map((name) => `${classRecord.id}/${name.normalize('NFC')}`)
  for (const file of files) {
    if (!sourceKeys.has(file)) failures.push(`데이터에 등록되지 않은 사진: ${file}`)
  }
}

for (const project of projects) {
  if (!photoIds.has(project.coverPhotoId)) failures.push(`프로젝트 대표 사진 없음: ${project.teamName}`)
  if (project.status === 'live' && !project.url) failures.push(`작품 링크 없음: ${project.teamName}`)
  if (project.status !== 'live' && project.url) failures.push(`비활성 작품에 링크가 등록됨: ${project.teamName}`)
  if (project.members?.includes(project.leader)) failures.push(`팀장이 팀원 목록에 중복 등록됨: ${project.teamName}`)

  const rosterNames = new Set(classStudents[project.classId].map((student) => student.name))
  for (const name of [project.leader, ...(project.members ?? [])]) {
    if (!rosterNames.has(name)) failures.push(`${project.teamName}의 ${name} 학생이 ${project.classId} 명단에 없습니다.`)
  }
}

const expectedStudentCounts: Record<PublishedClassId, number> = { '1-1': 20, '2-1': 15, '2-2': 14, '3-1': 15 }
for (const [classId, expectedCount] of Object.entries(expectedStudentCounts) as Array<[PublishedClassId, number]>) {
  const students = classStudents[classId]
  if (students.length !== expectedCount) failures.push(`${classId} 학생 수가 ${expectedCount}명이 아닙니다: ${students.length}`)
  const names = new Set(students.map((student) => student.name))
  if (names.size !== students.length) failures.push(`${classId} 학생 명단에 중복 이름이 있습니다.`)
  for (const student of students) {
    if (student.column < 1 || student.column > 12 || student.row < 1 || student.row > 7) {
      failures.push(`${classId} ${student.name}의 좌석 좌표가 범위를 벗어났습니다.`)
    }
  }
}

const publishedComments = studentComments.filter((item) => item.status === 'published')
const pendingComments = studentComments.filter((item) => item.status === 'pending')
const projectById = new Map(projects.map((project) => [project.id, project]))
const allowedRatings = new Set([4, 4.5, 5])

if (studentComments.length !== 64) failures.push(`학생 코멘트 상태 수가 64명이 아닙니다: ${studentComments.length}`)
if (publishedComments.length !== 61) failures.push(`공개 코멘트 수가 61명이 아닙니다: ${publishedComments.length}`)
if (pendingComments.length !== 3) failures.push(`준비 중 코멘트 수가 3명이 아닙니다: ${pendingComments.length}`)
if (publishedComments.reduce((total, item) => total + item.notes.length, 0) !== 178) failures.push('학생 코멘트 세부 항목 수가 178개가 아닙니다.')
if (classCommentaries.reduce((total, item) => total + item.review.length, 0) !== 11) failures.push('학급 총평 항목 수가 11개가 아닙니다.')
if (classCommentaries.filter((item) => item.mvps.length > 0).length !== 3) failures.push('MVP 학급 블록 수가 3개가 아닙니다.')

const commentIds = new Set<string>()
const commentStudentKeys = new Set<string>()
for (const comment of studentComments) {
  const studentKey = `${comment.classId}/${comment.name}`
  if (commentIds.has(comment.id)) failures.push(`중복 코멘트 ID: ${comment.id}`)
  if (commentStudentKeys.has(studentKey)) failures.push(`중복 학생 코멘트: ${studentKey}`)
  commentIds.add(comment.id)
  commentStudentKeys.add(studentKey)

  const rosterNames = new Set(classStudents[comment.classId].map((student) => student.name))
  if (!rosterNames.has(comment.name)) failures.push(`코멘트 학생이 좌석 명단에 없음: ${studentKey}`)

  if (comment.status === 'pending') {
    if (comment.notes.length || comment.rating || comment.role || comment.projectId) failures.push(`준비 중 코멘트에 공개 데이터가 있음: ${studentKey}`)
    continue
  }

  if (!comment.rating || !allowedRatings.has(comment.rating)) failures.push(`학생 평점 오류: ${studentKey}`)
  if (!comment.role?.trim()) failures.push(`학생 역할 없음: ${studentKey}`)
  if (!comment.notes.length || comment.notes.some((note) => !note.trim())) failures.push(`학생 코멘트 내용 없음: ${studentKey}`)
  if (!comment.projectId) {
    failures.push(`학생 프로젝트 연결 없음: ${studentKey}`)
    continue
  }

  const project = projectById.get(comment.projectId)
  if (!project || project.classId !== comment.classId) {
    failures.push(`학생 프로젝트 연결 오류: ${studentKey} → ${comment.projectId}`)
    continue
  }
  if (project.leader !== comment.name && !project.members?.includes(comment.name)) failures.push(`학생이 프로젝트 팀 명단에 없음: ${studentKey} → ${project.teamName}`)
  if (comment.isLeader && project.leader !== comment.name) failures.push(`학생 팀장 표시 오류: ${studentKey} → ${project.teamName}`)
}

for (const [classId, students] of Object.entries(classStudents) as Array<[PublishedClassId, (typeof classStudents)[PublishedClassId]]>) {
  for (const student of students) {
    if (!commentStudentKeys.has(`${classId}/${student.name}`)) failures.push(`학생 코멘트 상태 누락: ${classId}/${student.name}`)
  }
}

const expectedPending = new Set(['2-1/배나연', '3-1/정상호', '3-1/김해민'])
for (const comment of pendingComments) {
  const key = `${comment.classId}/${comment.name}`
  if (!expectedPending.has(key)) failures.push(`예상하지 않은 준비 중 학생: ${key}`)
}

for (const commentary of classCommentaries) {
  const rosterNames = new Set(classStudents[commentary.classId].map((student) => student.name))
  if (!commentary.review.length) failures.push(`학급 총평 없음: ${commentary.classId}`)
  for (const mvp of commentary.mvps) {
    if (!mvp.label.trim() || !mvp.studentNames.length) failures.push(`MVP 정보 없음: ${commentary.classId}`)
    for (const name of mvp.studentNames) {
      if (!rosterNames.has(name)) failures.push(`MVP 학생이 명단에 없음: ${commentary.classId}/${name}`)
    }
  }
}

if (schedule.length !== 4) failures.push(`수업 일정이 4일이 아닙니다: ${schedule.length}`)
if (!projects.some((project) => project.id === 'jeongeun' && project.status === 'live' && project.url === 'https://tetris-block-drop--asd92276407.replit.app/')) {
  failures.push('정은이네 테트리스 작품 링크가 정확하지 않습니다.')
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`검증 완료: ${photos.length}장, ${projects.length}개 팀, ${classes.length}개 반, 학생 ${Object.values(classStudents).flat().length}명, 코멘트 ${publishedComments.length}명·${publishedComments.reduce((total, item) => total + item.notes.length, 0)}개 항목`)
