import { access, readdir } from 'node:fs/promises'
import path from 'node:path'
import { classStudents, classes, photos, projects, schedule, type PublishedClassId } from '../src/data/archive.ts'

const root = process.cwd()
const failures: string[] = []
const publishedClasses = classes.filter((item) => item.status === 'published')
const photoIds = new Set<string>()
const sourceKeys = new Set<string>()

if (photos.length !== 32) failures.push(`등록 사진 수가 32장이 아닙니다: ${photos.length}`)

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
    .filter((name) => name.endsWith('.png'))
    .map((name) => `${classRecord.id}/${name.normalize('NFC')}`)
  for (const file of files) {
    if (!sourceKeys.has(file)) failures.push(`데이터에 등록되지 않은 사진: ${file}`)
  }
}

for (const project of projects) {
  if (!photoIds.has(project.coverPhotoId)) failures.push(`프로젝트 대표 사진 없음: ${project.teamName}`)
  if (project.status === 'live' && !project.url) failures.push(`작품 링크 없음: ${project.teamName}`)
  if (project.status !== 'live' && project.url) failures.push(`비활성 작품에 링크가 등록됨: ${project.teamName}`)
}

const expectedStudentCounts: Record<PublishedClassId, number> = { '2-1': 15, '2-2': 14, '3-1': 15 }
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

if (schedule.length !== 4) failures.push(`수업 일정이 4일이 아닙니다: ${schedule.length}`)
if (!projects.some((project) => project.id === 'jeongeun' && project.status === 'live' && project.url === 'https://tetris-block-drop--asd92276407.replit.app/')) {
  failures.push('정은이네 테트리스 작품 링크가 정확하지 않습니다.')
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`검증 완료: ${photos.length}장, ${projects.length}개 팀, ${classes.length}개 반, 학생 ${Object.values(classStudents).flat().length}명`)
