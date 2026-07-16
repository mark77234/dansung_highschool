export type ClassId = '1-1' | '1-2' | '2-1' | '2-2' | '3-1'
export type PublishedClassId = '1-1' | '2-1' | '2-2' | '3-1'
export type ClassStatus = 'published' | 'upcoming' | 'not-attended'
export type PhotoCategory = 'project' | 'classroom' | 'seat' | 'small-memory'
export type ProjectStatus = 'live' | 'deleted' | 'build-failed' | 'no-link'

export interface ClassRecord {
  id: ClassId
  label: string
  course: string
  status: ClassStatus
  kicker: string
  summary: string
  accent: string
  heroPhotoId?: string
}

export interface ProjectRecord {
  id: string
  classId: PublishedClassId
  teamName: string
  previousName?: string
  topic: string
  serviceName?: string
  coreFeature?: string
  leader: string
  members?: string[]
  coverPhotoId: string
  status: ProjectStatus
  url?: string
  note?: string
}

export interface PhotoRecord {
  id: string
  classId: PublishedClassId
  source: string
  category: PhotoCategory
  title: string
  caption: string
  alt: string
}

export interface ScheduleRecord {
  date: string
  classId: Exclude<ClassId, '1-2'>
  status: 'completed' | 'upcoming'
}

export interface StudentSeat {
  name: string
  column: number
  row: number
}

export const classes: ClassRecord[] = [
  {
    id: '1-1',
    label: '1학년 1반',
    course: '바이브코딩으로 게임 만들기',
    status: 'published',
    kicker: '07.16 · VIBE CODING',
    summary: '오목, 밸런스 게임, 숨은 그림 찾기, 나무 탐구까지. 네 팀이 각자의 아이디어를 직접 화면으로 옮긴 1학년 1반의 바이브코딩 수업입니다.',
    accent: '#6f8f72',
    heroPhotoId: '11-group',
  },
  {
    id: '1-2',
    label: '1학년 2반',
    course: '수업 미진행',
    status: 'not-attended',
    kicker: 'WE MISSED YOU',
    summary: '일정상 이번 수업을 진행하지 못해 기록이 없습니다. 다음 기회에는 함께할 수 있기를 바랍니다.',
    accent: '#7e77a8',
  },
  {
    id: '2-1',
    label: '2학년 1반',
    course: '바이브코딩 수업',
    status: 'published',
    kicker: 'VIBE CODING',
    summary: '웹 서비스와 게임을 직접 기획하고 구현했습니다. 질병 정보, 여행 코스, 체스, 테트리스 네 팀의 작업을 정리했습니다.',
    accent: '#df6b2f',
    heroPhotoId: '21-classroom-1',
  },
  {
    id: '2-2',
    label: '2학년 2반',
    course: '파이썬으로 게임 만들기',
    status: 'published',
    kicker: 'PYTHON GAME LAB',
    summary: '파이썬으로 피아노 타일, 루미큐브, 스도쿠, FPS, 롤을 주제로 게임을 만들었습니다. 실행 링크가 없는 작품은 기획서로 기록했습니다.',
    accent: '#2e7184',
    heroPhotoId: '22-classroom-1',
  },
  {
    id: '3-1',
    label: '3학년 1반',
    course: '바이브코딩 수업',
    status: 'published',
    kicker: 'VIBE CODING',
    summary: 'ASMR, 패션, 맛집 추천 웹 서비스를 만들었습니다. 프로젝트 기획서와 수업 중 남긴 사진을 함께 정리했습니다.',
    accent: '#b34f59',
    heroPhotoId: '31-classroom-4',
  },
]

export const schedule: ScheduleRecord[] = [
  { date: '07.13', classId: '2-1', status: 'completed' },
  { date: '07.14', classId: '2-2', status: 'completed' },
  { date: '07.15', classId: '3-1', status: 'completed' },
  { date: '07.16', classId: '1-1', status: 'completed' },
]

// ClassPilot screenshots use a free-positioned canvas. These grid coordinates
// preserve the relative rows and groups while keeping the layout responsive.
export const classStudents: Record<PublishedClassId, StudentSeat[]> = {
  '1-1': [
    { name: '윤서진', column: 1, row: 1 },
    { name: '정시훈', column: 3, row: 1 },
    { name: '김소율', column: 1, row: 2 },
    { name: '이정인', column: 3, row: 2 },
    { name: '길효승', column: 1, row: 3 },
    { name: '정유미', column: 3, row: 5 },
    { name: '문혜원', column: 1, row: 6 },
    { name: '고경현', column: 3, row: 6 },
    { name: '김남우', column: 1, row: 7 },
    { name: '이태규', column: 3, row: 7 },
    { name: '양희재', column: 9, row: 1 },
    { name: '우시연', column: 8, row: 2 },
    { name: '김민혁', column: 10, row: 2 },
    { name: '권신영', column: 8, row: 3 },
    { name: '이성제', column: 10, row: 3 },
    { name: '박솔민', column: 9, row: 5 },
    { name: '노강민', column: 8, row: 6 },
    { name: '박지연', column: 10, row: 6 },
    { name: '이다윤', column: 8, row: 7 },
    { name: '심건우', column: 10, row: 7 },
  ],
  '2-1': [
    { name: '형지안', column: 2, row: 1 },
    { name: '한승민', column: 4, row: 1 },
    { name: '박천용', column: 6, row: 1 },
    { name: '오세찬', column: 9, row: 1 },
    { name: '김민호', column: 11, row: 1 },
    { name: '임나영', column: 9, row: 2 },
    { name: '김유진', column: 11, row: 2 },
    { name: '이나림', column: 1, row: 4 },
    { name: '김영희', column: 3, row: 4 },
    { name: '오지훈', column: 1, row: 5 },
    { name: '박진수', column: 3, row: 5 },
    { name: '홍성은', column: 8, row: 6 },
    { name: '이송윤', column: 10, row: 6 },
    { name: '배나연', column: 8, row: 7 },
    { name: '연새봄', column: 10, row: 7 },
  ],
  '2-2': [
    { name: '김민재', column: 4, row: 1 },
    { name: '황세호', column: 11, row: 1 },
    { name: '조윤찬', column: 2, row: 2 },
    { name: '김하율', column: 5, row: 2 },
    { name: '퀸민지', column: 10, row: 2 },
    { name: '김민권', column: 12, row: 2 },
    { name: '하지윤', column: 7, row: 4 },
    { name: '백진욱', column: 9, row: 4 },
    { name: '강세영', column: 3, row: 5 },
    { name: '권세룡', column: 10, row: 5 },
    { name: '강지유', column: 10, row: 6 },
    { name: '백승화', column: 2, row: 7 },
    { name: '김교린', column: 5, row: 7 },
    { name: '문세정', column: 10, row: 7 },
  ],
  '3-1': [
    { name: '정상호', column: 7, row: 1 },
    { name: '정아영', column: 1, row: 2 },
    { name: '이채현', column: 3, row: 2 },
    { name: '오가현', column: 5, row: 2 },
    { name: '조민서', column: 7, row: 2 },
    { name: '이예희', column: 5, row: 3 },
    { name: '김다희', column: 7, row: 3 },
    { name: '김재현', column: 1, row: 4 },
    { name: '강유지', column: 3, row: 4 },
    { name: '박진우', column: 9, row: 5 },
    { name: '노정원', column: 11, row: 5 },
    { name: '유원준', column: 9, row: 6 },
    { name: '김누리한', column: 11, row: 6 },
    { name: '김해민', column: 1, row: 7 },
    { name: '정수환', column: 11, row: 7 },
  ],
}

export const projects: ProjectRecord[] = [
  {
    id: 'wonji-cortis', classId: '1-1', teamName: '원지 코르티스', topic: '게임', serviceName: '오목', leader: '이다윤',
    members: ['노강민', '이다윤', '심건우', '박지연', '박솔민'], coverPhotoId: '11-project-wonji', status: 'build-failed',
    note: '배포 과정에서 오류가 발생해 실행 링크는 남기지 못했습니다.',
  },
  {
    id: 'yanggogi', classId: '1-1', teamName: '양고기', topic: '게임', serviceName: '밸런스게임', coreFeature: '투표 기능', leader: '양희재',
    members: ['권신영', '김민혁', '우시연', '양희재', '이성제'], coverPhotoId: '11-project-yanggogi', status: 'no-link',
    note: '완성된 밸런스게임 화면을 사진으로 기록했습니다.',
  },
  {
    id: 'hyogo', classId: '1-1', teamName: '효고', topic: '숨은 그림 찾기', serviceName: '숨은픽', leader: '길효승',
    members: ['정시훈', '김소율', '이정인', '윤서진'], coverPhotoId: '11-project-hyogo', status: 'no-link',
    note: '완성된 숨은 그림 찾기 게임을 사진으로 기록했습니다.',
  },
  {
    id: 'leaf', classId: '1-1', teamName: '나뭇잎', topic: '나무 탐구', serviceName: '헌터헌터 (HUNTER X HUNTER)', leader: '문혜원',
    members: ['김남우', '이태규', '고경현', '정유미'], coverPhotoId: '11-project-leaf', status: 'no-link',
    note: '완성된 나무 탐구 게임 화면을 사진으로 기록했습니다.',
  },
  {
    id: 'hongsi', classId: '2-1', teamName: '홍시', topic: '질병의 모든 것', leader: '이송윤',
    members: ['이송윤', '연새봄', '홍성은'], coverPhotoId: '21-project-hongsi', status: 'live',
    url: 'https://drug-dictionary--a90861323.replit.app/',
  },
  {
    id: 'oz', classId: '2-1', teamName: 'OZ의 마법사', topic: '일본 여행 코스를 짜주는 앱', leader: '김유진',
    coverPhotoId: '21-project-oz', status: 'live', url: 'https://japan-trip-coach--eugenekim4444.replit.app/',
  },
  {
    id: 'sparkle', classId: '2-1', teamName: '스파클', topic: '체스 게임', leader: '박천용',
    members: ['한승민', '박천용', '형지안'], coverPhotoId: '21-project-sparkle', status: 'live',
    url: 'https://chess-board-logic--hjkl95922.replit.app/',
  },
  {
    id: 'jeongeun', classId: '2-1', teamName: '정은이네', topic: '테트리스 게임', leader: '박진수',
    members: ['이나림', '김영희', '오지훈'], coverPhotoId: '21-project-jeongeun', status: 'live',
    url: 'https://tetris-block-drop--asd92276407.replit.app/',
  },
  {
    id: 'ganghwa-seyoung', classId: '2-2', teamName: '강화세영', topic: '피아노 타일', leader: '김교린',
    members: ['백승화', '김교린', '강세영'], coverPhotoId: '22-project-piano', status: 'deleted',
    note: '프로젝트가 삭제되어 현재는 기획서만 확인할 수 있습니다.',
  },
  {
    id: 'ssangdi', classId: '2-2', teamName: '쌍디무하자', topic: '루미큐브 한글 버전', leader: '데돈니(문세정)',
    members: ['지유', '서형'], coverPhotoId: '22-project-rummikub', status: 'build-failed',
    note: '빌드 실패로 현재 실행할 수 없습니다.',
  },
  {
    id: 'black-bear', classId: '2-2', teamName: '검은 흑곰', topic: '스도쿠', leader: '백진욱',
    members: ['백진욱', '하지윤'], coverPhotoId: '22-project-sudoku', status: 'build-failed',
    note: '빌드 실패로 현재 실행할 수 없습니다.',
  },
  {
    id: 'eyebrow', classId: '2-2', teamName: '회장 반장 팀장 눈썹색은 된장 김하율이 있는 팀', topic: 'FPS 게임', leader: '김하율',
    members: ['김민재', '김하율', '조윤찬'], coverPhotoId: '22-project-fps', status: 'deleted',
    note: '프로젝트가 삭제되어 현재는 기획서만 확인할 수 있습니다.',
  },
  {
    id: 'nexon', classId: '2-2', teamName: '넥슨', topic: '게임(롤)', leader: '퀸민지',
    members: ['권(퀸)민지', '김민권', '황세호'], coverPhotoId: '22-project-nexon', status: 'build-failed',
    note: '빌드 실패로 실행 링크가 남아 있지 않습니다.',
  },
  {
    id: 'nugo', classId: '3-1', teamName: '누고', topic: '스트레스 해소 ASMR', leader: '정수환',
    members: ['유원준', '김누리한', '노정원', '정수환', '박진우'], coverPhotoId: '31-project-nugo', status: 'live',
    url: 'https://nugo-teal.vercel.app/',
  },
  {
    id: 'jego', classId: '3-1', teamName: '재고', previousName: '가고없는 가고팀', topic: '옷 관련 웹사이트', leader: '정아영',
    members: ['강유지', '김재현', '이채현'], coverPhotoId: '31-project-jego', status: 'live',
    url: 'https://jego-brown.vercel.app/#home',
  },
  {
    id: 'gago', classId: '3-1', teamName: '가고', previousName: '가고 있는 가고팀', topic: '맛집 추천', leader: '가고(오가현)',
    members: ['김다희', '오가현', '이예희', '조민서'], coverPhotoId: '31-project-gago', status: 'live',
    url: 'https://gago-eta.vercel.app/',
  },
]

export const photos: PhotoRecord[] = [
  { id: '11-project-wonji', classId: '1-1', source: '1-1_원지코르티스_프로젝트사진.jpg', category: 'project', title: '오목', caption: '원지 코르티스 팀이 구현한 오목 게임', alt: '노트북 화면에 실행 중인 원지 코르티스 팀의 오목 게임' },
  { id: '11-plan-wonji', classId: '1-1', source: '1-1_원지코르티스팀.jpg', category: 'project', title: '원지 코르티스 기획서', caption: '오목 게임의 규칙과 핵심 기능을 정리한 기록', alt: '원지 코르티스 팀이 손으로 작성한 오목 게임 기획서' },
  { id: '11-project-yanggogi', classId: '1-1', source: '1-1_양고기_프로젝트사진.png', category: 'project', title: '밸런스게임', caption: '양고기 팀이 구현한 투표형 밸런스게임', alt: '노트북 화면에 실행 중인 양고기 팀의 밸런스게임' },
  { id: '11-plan-yanggogi', classId: '1-1', source: '1-1_양고기팀.jpg', category: 'project', title: '양고기 기획서', caption: '밸런스게임과 투표 기능을 정리한 기록', alt: '양고기 팀이 손으로 작성한 밸런스게임 기획서' },
  { id: '11-project-hyogo', classId: '1-1', source: '1-1_효고_프로젝트사진.jpg', category: 'project', title: '숨은픽', caption: '효고 팀이 구현한 숨은 그림 찾기 게임', alt: '노트북 화면에 실행 중인 효고 팀의 숨은 그림 찾기 게임 숨은픽' },
  { id: '11-plan-hyogo', classId: '1-1', source: '1-1_효고팀.jpg', category: 'project', title: '효고 기획서', caption: '숨은픽의 규칙과 점수 방식을 정리한 기록', alt: '효고 팀이 손으로 작성한 숨은 그림 찾기 게임 기획서' },
  { id: '11-project-leaf', classId: '1-1', source: '1-1_나뭇잎_프로젝트사진.jpg', category: 'project', title: '헌터헌터', caption: '나뭇잎 팀이 구현한 나무 탐구 게임', alt: '노트북 화면에 실행 중인 나뭇잎 팀의 헌터헌터 게임' },
  { id: '11-plan-leaf', classId: '1-1', source: '1-1_나뭇잎팀.jpg', category: 'project', title: '나뭇잎 기획서', caption: '헌터헌터의 탐구 방식과 대화를 정리한 기록', alt: '나뭇잎 팀이 손으로 작성한 나무 탐구 게임 기획서' },
  { id: '11-seat', classId: '1-1', source: '1-1_좌석배치표.jpg', category: 'seat', title: 'ClassPilot 좌석배치도', caption: '7월 16일 1학년 1반 좌석 기록', alt: '교실 전자칠판에 표시된 1학년 1반 ClassPilot 좌석배치도' },
  { id: '11-classroom-1', classId: '1-1', source: '1-1_수업사진1.jpg', category: 'classroom', title: '첫 아이디어', caption: '팀별 주제와 서비스 방향을 나누던 시간', alt: '교실에서 모둠별로 아이디어를 이야기하는 1학년 1반 학생들' },
  { id: '11-classroom-2', classId: '1-1', source: '1-1_수업사진2.jpg', category: 'classroom', title: '화면으로 옮기기', caption: '아이디어를 직접 구현하던 프로젝트 시간', alt: '노트북과 태블릿을 보며 프로젝트를 진행하는 1학년 1반 학생들' },
  { id: '11-classroom-3', classId: '1-1', source: '1-1_수업사진3.jpg', category: 'classroom', title: '함께 테스트하기', caption: '완성되어 가는 게임을 함께 확인하던 순간', alt: '한 노트북 화면을 함께 보며 게임을 테스트하는 학생들' },
  { id: '11-classroom-4', classId: '1-1', source: '1-1_수업사진4.jpg', category: 'classroom', title: '팀별 작업', caption: '대화와 코딩이 오가던 교실', alt: '모둠 책상에 둘러앉아 프로젝트를 진행하는 학생들' },
  { id: '11-classroom-5', classId: '1-1', source: '1-1_수업사진5.jpg', category: 'classroom', title: '오늘의 교실', caption: '네 팀이 각자의 게임을 만들던 7월 16일', alt: '교실 전체에서 네 팀이 프로젝트를 진행하는 모습' },
  { id: '11-classroom-6', classId: '1-1', source: '1-1_수업사진6.jpg', category: 'classroom', title: '마지막 집중', caption: '마무리까지 서로 도우며 완성한 수업', alt: '수업 마무리 시간에 팀별 작업을 이어가는 학생들' },
  { id: '11-group', classId: '1-1', source: '1-1_단체사진.jpg', category: 'classroom', title: '우리, 1학년 1반', caption: '7월 16일 수업을 마치고 함께 남긴 단체사진', alt: '교실에서 다 함께 웃고 포즈를 취한 1학년 1반 학생들과 병찬 선생님' },
  { id: '21-project-oz', classId: '2-1', source: '2-1_OZ의마법사팀.png', category: 'project', title: 'OZ의 마법사', caption: '일본 여행 코스 추천 앱 기획서', alt: 'OZ의 마법사 팀이 작성한 일본 여행 앱 기획서' },
  { id: '21-seat', classId: '2-1', source: '2-1_교실학생배치도.png', category: 'seat', title: 'ClassPilot 좌석배치도', caption: '7월 13일 2학년 1반 좌석 기록', alt: 'ClassPilot 화면에 표시된 2학년 1반 학생 좌석배치도' },
  { id: '21-classroom-1', classId: '2-1', source: '2-1_수업사진1.png', category: 'classroom', title: '프로젝트 작업', caption: '팀별 웹 서비스와 게임 제작', alt: '교실에서 노트북으로 팀 프로젝트를 진행하는 2학년 1반 학생들' },
  { id: '21-classroom-2', classId: '2-1', source: '2-1_수업사진2.png', category: 'classroom', title: '모둠 작업', caption: '기획 내용을 구현하던 수업 시간', alt: '모둠으로 둘러앉아 수업하는 2학년 1반 학생들' },
  { id: '21-project-sparkle', classId: '2-1', source: '2-1_스파클팀.png', category: 'project', title: '스파클', caption: '체스 게임 기획서', alt: '스파클 팀의 체스 게임 기획서' },
  { id: '21-snack', classId: '2-1', source: '2-1_유진이가준일본과자.png', category: 'small-memory', title: '유진이가 준 일본 과자', caption: '수업 중 함께 나눠 먹은 간식', alt: '책상 위에 놓인 일본 과자와 간식' },
  { id: '21-project-jeongeun', classId: '2-1', source: '2-1_정은이네팀.png', category: 'project', title: '정은이네', caption: '테트리스 게임 기획서', alt: '정은이네 팀의 테트리스 게임 기획서' },
  { id: '21-project-hongsi', classId: '2-1', source: '2-1_홍시팀.png', category: 'project', title: '홍시', caption: '질병 정보 서비스 기획서', alt: '홍시 팀의 질병 정보 앱 기획서' },

  { id: '22-project-piano', classId: '2-2', source: '2-2_강화세영.png', category: 'project', title: '강화세영', caption: '피아노 타일 게임 기획서', alt: '강화세영 팀의 피아노 타일 게임 기획서' },
  { id: '22-project-fps', classId: '2-2', source: '2-2_회장반장팀장눈썹색은된장김하율이있는팀.png', category: 'project', title: '세상에서 가장 긴 팀명', caption: 'FPS 게임 기획서', alt: '회장 반장 팀장 눈썹색은 된장 김하율이 있는 팀의 FPS 기획서' },
  { id: '22-seat', classId: '2-2', source: '2-2_교실좌석배치도.png', category: 'seat', title: 'ClassPilot 좌석배치도', caption: '7월 14일 2학년 2반 좌석 기록', alt: 'ClassPilot 화면에 표시된 2학년 2반 학생 좌석배치도' },
  { id: '22-project-rummikub', classId: '2-2', source: '2-2_쌍디무하자.png', category: 'project', title: '쌍디무하자', caption: '한글 루미큐브 게임 기획서', alt: '쌍디무하자 팀의 한글 루미큐브 기획서' },
  { id: '22-project-nexon', classId: '2-2', source: '2-2_넥슨.png', category: 'project', title: '넥슨', caption: '롤을 주제로 한 게임 기획서', alt: '넥슨 팀의 롤 게임 기획서' },
  { id: '22-classroom-3', classId: '2-2', source: '2-2_수업사진3.png', category: 'classroom', title: '모둠 작업', caption: '파이썬 게임 구현 과정', alt: '모둠별로 노트북을 보며 게임을 만드는 2학년 2반 학생들' },
  { id: '22-classroom-2', classId: '2-2', source: '2-2_수업사진2.png', category: 'classroom', title: '게임 제작', caption: '수업 화면을 따라 구현하던 시간', alt: '수업 화면을 바라보며 게임을 만드는 학생들' },
  { id: '22-project-sudoku', classId: '2-2', source: '2-2_검은흑곰.png', category: 'project', title: '검은 흑곰', caption: '스도쿠 게임 기획서', alt: '검은 흑곰 팀의 스도쿠 게임 기획서' },
  { id: '22-classroom-1', classId: '2-2', source: '2-2_수업사진1.png', category: 'classroom', title: '수업 단체 사진', caption: '7월 14일 2학년 2반', alt: '교실에서 함께 포즈를 취한 2학년 2반 학생들' },

  { id: '31-project-nugo', classId: '3-1', source: '3-1_누고팀.png', category: 'project', title: '누고', caption: 'ASMR 서비스 기획서', alt: '누고 팀의 ASMR 웹사이트 기획서' },
  { id: '31-lunch-line', classId: '3-1', source: '3-1_점심시간1분전미리가는사진.png', category: 'small-memory', title: '점심시간 1분 전', caption: '급식실로 이동하기 전', alt: '점심시간 직전 교실 문가에 모인 학생들' },
  { id: '31-lunch-together', classId: '3-1', source: '3-1_급식같이먹어준3-1반.png', category: 'small-memory', title: '급식실', caption: '3학년 1반과 함께한 점심', alt: '단성고 급식실에서 함께 식사하는 학생들' },
  { id: '31-classroom-2', classId: '3-1', source: '3-1_수업사진2.png', category: 'classroom', title: '기획 회의', caption: '팀별 서비스 주제와 기능 정리', alt: '교실에서 함께 앉아 아이디어를 나누는 3학년 1반 학생들' },
  { id: '31-project-gago', classId: '3-1', source: '3-1_가고팀.png', category: 'project', title: '가고', caption: '맛집 추천 웹사이트 기획서', alt: '가고 팀의 맛집 추천 웹사이트 기획서' },
  { id: '31-classroom-3', classId: '3-1', source: '3-1_수업사진3.png', category: 'classroom', title: '모둠 작업', caption: '기획을 화면으로 옮기던 과정', alt: '모둠 활동 중인 3학년 1반 학생들' },
  { id: '31-classroom-1', classId: '3-1', source: '3-1_수업사진1.png', category: 'classroom', title: '프로젝트 작업', caption: '팀별 웹사이트 구현', alt: '노트북으로 팀 프로젝트를 하는 3학년 1반 학생들' },
  { id: '31-caricature-suhwan', classId: '3-1', source: '3-1_수환이캐리커쳐.png', category: 'small-memory', title: '수환이 캐리커처', caption: '수업 중 태블릿으로 그린 그림', alt: '태블릿으로 그린 수환 학생의 캐리커처' },
  { id: '31-chocopie', classId: '3-1', source: '3-1_초코파이선물.png', category: 'small-memory', title: '초코파이 선물', caption: '수업 중 받은 간식', alt: '손에 들고 있는 초코파이 선물' },
  { id: '31-classroom-4', classId: '3-1', source: '3-1_수업사진4.png', category: 'classroom', title: '수업 단체 사진', caption: '7월 15일 3학년 1반', alt: '교실에서 함께 사진을 찍는 3학년 1반 학생들' },
  { id: '31-seat', classId: '3-1', source: '3-1_학생좌석배치도.png', category: 'seat', title: 'ClassPilot 좌석배치도', caption: '7월 15일 3학년 1반 좌석 기록', alt: 'ClassPilot 화면에 표시된 3학년 1반 학생 좌석배치도' },
  { id: '31-caricature-me', classId: '3-1', source: '3-1_내얼굴캐리커쳐.png', category: 'small-memory', title: '병찬쌤 초상화', caption: '3학년 1반 재현이가 그린 병찬쌤 초상화', alt: '3학년 1반 재현이가 태블릿으로 그린 병찬 선생님 초상화' },
  { id: '31-project-jego', classId: '3-1', source: '3-1_재고팀.png', category: 'project', title: '재고', caption: '패션 웹사이트 기획서', alt: '재고 팀의 패션 웹사이트 기획서' },
  { id: '31-caricature-jaehyun', classId: '3-1', source: '3-1_재현이캐리커쳐.png', category: 'small-memory', title: '재현이 캐리커처', caption: '수업 중 태블릿으로 그린 그림', alt: '태블릿으로 그린 재현 학생의 캐리커처' },
  { id: '31-first-last-lunch', classId: '3-1', source: '3-1_처음이자마지막단성고급식.png', category: 'small-memory', title: '단성고 급식', caption: '수업 날 먹은 점심', alt: '단성고 급식 식판에 담긴 점심 메뉴' },
]

export const categoryLabels: Record<PhotoCategory | 'all', string> = {
  all: '전체',
  project: '팀 프로젝트',
  classroom: '수업 사진',
  seat: 'ClassPilot',
  'small-memory': '기타 기록',
}

export function photoAsset(photo: Pick<PhotoRecord, 'id'>, size: 'card' | 'large' = 'card') {
  return `/media/${photo.id}-${size}.webp`
}

export function getPhoto(id: string) {
  return photos.find((photo) => photo.id === id)
}

export function getClass(id: ClassId) {
  return classes.find((classRecord) => classRecord.id === id)
}

export function getClassLabel(id: ClassId) {
  return getClass(id)?.label ?? id
}
