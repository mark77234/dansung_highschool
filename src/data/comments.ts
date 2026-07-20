import type { PublishedClassId } from './archive'

export type StudentCommentStatus = 'published' | 'pending'
export type StudentRating = 4 | 4.5 | 5

export interface StudentCommentRecord {
  id: string
  classId: PublishedClassId
  name: string
  projectId?: string
  rating?: StudentRating
  role?: string
  notes: string[]
  status: StudentCommentStatus
  isLeader?: boolean
}

export interface ClassMvpRecord {
  label: string
  studentNames: string[]
}

export interface ClassCommentaryRecord {
  classId: PublishedClassId
  review: string[]
  mvps: ClassMvpRecord[]
}

export const studentComments: StudentCommentRecord[] = [
  {
    id: '2-1-이송윤', classId: '2-1', name: '이송윤', projectId: 'hongsi', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '홍시 팀 프로젝트의 팀장을 맡았어요.',
      '팀원들을 잘 주도하고, 필요할 때는 학생들을 조용히 이끌 줄 알았어요.',
      '프로젝트 주제는 “질병의 모든 것”이었어요.',
      '완성 제품 링크는 https://drug-dictionary--a90861323.replit.app/ 입니다. 체험 기간이 지나면 웹사이트 접속이 어려울 수 있으며, 이 안내는 모든 웹사이트에 공통으로 적용돼요.',
    ],
  },
  {
    id: '2-1-연새봄', classId: '2-1', name: '연새봄', projectId: 'hongsi', rating: 5, role: '기능 명세', status: 'published',
    notes: ['홍시 팀의 팀원으로서 노트북을 주도적으로 사용했고, 프로젝트 프롬프트를 작성한 뒤 한글 문서로 정리해 팀원들과 소통하며 기능 명세서를 완성했어요.'],
  },
  {
    id: '2-1-홍성은', classId: '2-1', name: '홍성은', projectId: 'hongsi', rating: 5, role: '주제 기획', status: 'published',
    notes: ['새봄이처럼 노트북을 직접 사용하지는 않았지만, 다른 주제를 정하는 과정에서 많은 도움을 줬어요.'],
  },
  {
    id: '2-1-김유진', classId: '2-1', name: '김유진', projectId: 'oz', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      'OZ의 마법사 팀 프로젝트의 팀장을 맡았어요.',
      '최근 일본을 다녀온 경험을 살려 일본 여행 코스를 짜주는 앱을 만들었어요.',
      '팀명은 귀여운 아프로·폭탄 머리 같은 유진이의 머리카락에서 지은 것 같아요.',
      '기능을 구체화하며 프로젝트의 완성도를 주도적으로 크게 높였어요.',
    ],
  },
  {
    id: '2-1-임나영', classId: '2-1', name: '임나영', projectId: 'oz', rating: 4.5, role: '기능 기획', status: 'published',
    notes: ['유진이 앞자리에서 주제 선정과 기능 구체화에 주도적으로 힘썼어요. 가끔 휴대폰으로 다른 정보를 보며 딴짓을 하기도 했어요.'],
  },
  {
    id: '2-1-오세찬', classId: '2-1', name: '오세찬', projectId: 'oz', rating: 4.5, role: '발표', status: 'published',
    notes: [
      '말을 재치 있게 잘해서 웃겼고, 민호와 자꾸 티격태격했어요.',
      '발표도 주도적으로 했고 실행력은 정말 대단했어요.',
      '다만 집중을 꾸준히 잘하지는 못했어요.',
    ],
  },
  {
    id: '2-1-김민호', classId: '2-1', name: '김민호', projectId: 'oz', rating: 4, role: '프로젝트 지원', status: 'published',
    notes: [
      '시키면 맡은 일을 잘했어요.',
      '다만 시키지 않으면 먼저 나서지는 않았어요.',
      '자꾸 침을 뱉으러 자리를 비우곤 했어요.',
      '집중을 잘하지 못할 때가 있었어요.',
    ],
  },
  {
    id: '2-1-박천용', classId: '2-1', name: '박천용', projectId: 'sparkle', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '스파클 팀 프로젝트의 팀장을 맡았어요.',
      '체스 게임을 만들었어요.',
      '체스를 좋아하는 만큼 프로젝트 생성과 기능 구체화에 주도적으로 참여했어요.',
    ],
  },
  {
    id: '2-1-한승민', classId: '2-1', name: '한승민', projectId: 'sparkle', rating: 5, role: 'AI 기능 기획', status: 'published',
    notes: ['승민이도 체스를 좋아해서 기능을 구체화하고 AI 기능 도입을 추진했어요.'],
  },
  {
    id: '2-1-형지안', classId: '2-1', name: '형지안', projectId: 'sparkle', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: [
      '지안이는 체스를 좋아하는 것 같지는 않지만 엄청 똑똑하다고 들었어요.',
      '그래서 지안이의 이름을 따 서비스명을 “지안체스”로 정했어요.',
      '눈에 잘 띄지는 않았지만 열심히 활동했을 것으로 생각해요.',
    ],
  },
  {
    id: '2-1-박진수', classId: '2-1', name: '박진수', projectId: 'jeongeun', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '정은이네 팀 프로젝트의 팀장을 맡았어요.',
      '블록 블라스트 같은 테트리스 게임을 만들었어요.',
      '팀에서 가장 열심히 참여했어요.',
      '프롬프트 작성과 생성, 기능 구체화 등 여러 과정에 열심히 참여했어요.',
    ],
  },
  {
    id: '2-1-김영희', classId: '2-1', name: '김영희', projectId: 'jeongeun', rating: 5, role: '발표', status: 'published',
    notes: [
      '진수 다음으로 열심히 참여했어요.',
      '진수 옆자리에서 함께 열심히 프로젝트를 진행했어요.',
      '발표도 맡아서 해냈어요.',
    ],
  },
  {
    id: '2-1-오지훈', classId: '2-1', name: '오지훈', projectId: 'jeongeun', rating: 4, role: '게임 테스트', status: 'published',
    notes: [
      '시키면 잘했지만 자주 먼저 하지는 않았어요.',
      '완성된 게임은 열심히 플레이했어요.',
    ],
  },
  {
    id: '2-1-이나림', classId: '2-1', name: '이나림', projectId: 'jeongeun', rating: 4, role: '프로젝트 지원', status: 'published',
    notes: ['나림이도 시키면 잘했지만, 지켜보지 않으면 먼저 하지는 않았어요.'],
  },
  { id: '2-1-배나연', classId: '2-1', name: '배나연', notes: [], status: 'pending' },

  {
    id: '2-2-김교린', classId: '2-2', name: '김교린', projectId: 'ganghwa-seyoung', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '강화세영 팀 프로젝트의 팀장을 맡았어요.',
      '완성도가 가장 높았던 피아노 타일 게임을 만들었어요.',
      '팀원들과 열심히 소통하고 발표까지 맡으며 수업 전체에 적극적으로 참여했어요.',
    ],
  },
  {
    id: '2-2-강세영', classId: '2-2', name: '강세영', projectId: 'ganghwa-seyoung', rating: 5, role: '기능 기획', status: 'published',
    notes: ['세영이도 교린이와 함께 열정적으로 프로젝트에 참여했어요.'],
  },
  {
    id: '2-2-백승화', classId: '2-2', name: '백승화', projectId: 'ganghwa-seyoung', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: ['승화도 세영이와 교린이가 잘 챙겨준 덕분에 프로젝트에 열심히 참여했어요.'],
  },
  {
    id: '2-2-문세정', classId: '2-2', name: '문세정', projectId: 'ssangdi', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '쌍디무하자 팀의 팀장을 맡았어요.',
      '루미큐브 한글 버전을 성공적으로 만들었지만 빌드에는 실패했어요.',
      '팀원들을 잘 주도했어요.',
      '수업에 적극적으로 참여했어요.',
    ],
  },
  {
    id: '2-2-강지유', classId: '2-2', name: '강지유', projectId: 'ssangdi', rating: 5, role: '팀 소통', status: 'published',
    notes: ['지유도 세정이와 마찬가지로 수업에 적극적으로 참여했어요.'],
  },
  {
    id: '2-2-권서형', classId: '2-2', name: '권서형', projectId: 'ssangdi', rating: 5, role: '프롬프트 작성', status: 'published',
    notes: ['서형이는 노트북을 담당했고, 지유와 세정이가 기능을 제안하면 그대로 프롬프트로 작성하는 데 힘썼어요.'],
  },
  {
    id: '2-2-백진욱', classId: '2-2', name: '백진욱', projectId: 'black-bear', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '검은흑곰 팀의 팀장을 맡았어요.',
      '스도쿠가 완성됐는지는 제대로 확인하지 못했어요.',
      '오류가 자주 발생해 진행이 늦어졌지만 끝까지 열심히 참여했어요.',
      '두 명뿐인 팀에서 열심히 프로젝트를 이끌었어요.',
    ],
  },
  {
    id: '2-2-하지윤', classId: '2-2', name: '하지윤', projectId: 'black-bear', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: ['지윤이도 옆에서 진욱이를 많이 도와줬어요.'],
  },
  {
    id: '2-2-김하율', classId: '2-2', name: '김하율', projectId: 'eyebrow', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '“회장 반장 팀장 눈썹색은 된장 김하율이 있는 팀”의 팀장을 맡았어요.',
      'FPS 게임을 만들었어요.',
      '학생회장답게 수업에 적극적이고 주도적으로 참여했어요.',
      '발표도 씩씩하게 잘했어요.',
    ],
  },
  {
    id: '2-2-김민재', classId: '2-2', name: '김민재', projectId: 'eyebrow', rating: 5, role: '프롬프트 작성', status: 'published',
    notes: ['노트북을 담당하며 팀의 프롬프트 작성에 힘썼어요.'],
  },
  {
    id: '2-2-조윤찬', classId: '2-2', name: '조윤찬', projectId: 'eyebrow', rating: 5, role: '기능 실행', status: 'published',
    notes: [
      '웃기고 시끄럽고 집중하지 못할 때도 있었어요.',
      '하지만 열심히 할 때는 누구보다 열심히 했어요.',
      '완성도가 나쁘지 않았고, 윤찬이가 주도해 프로젝트가 진행되는 모습이 보였어요.',
    ],
  },
  {
    id: '2-2-권민지', classId: '2-2', name: '권민지', projectId: 'nexon', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '팀장으로서 프롬프트 작성에 힘썼어요.',
      '리그 오브 레전드와 유사한 게임 만들기에 도전했지만 완성에는 실패했어요.',
    ],
  },
  {
    id: '2-2-김민권', classId: '2-2', name: '김민권', projectId: 'nexon', rating: 5, role: '팀 소통', status: 'published',
    notes: [
      '싹싹하고 수업에 정말 열심히 참여했어요.',
      '밝고 재미있는 학생이었어요.',
      '안 하는 것처럼 보일 때도 있었지만 프로젝트에는 열심히 참여했어요.',
    ],
  },
  {
    id: '2-2-황세호', classId: '2-2', name: '황세호', projectId: 'nexon', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: [
      '세호도 수업에 열심히 참여했어요.',
      '시키면 맡은 일을 잘했어요.',
    ],
  },

  {
    id: '3-1-정수환', classId: '3-1', name: '정수환', projectId: 'nugo', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '누고 팀의 팀장을 맡았어요.',
      '소리 중심의 ASMR 서비스 “왁뿌”를 높은 완성도로 만들었어요.',
      '팀원들을 열심히 이끌며 스스로 팀장을 맡았어요.',
      '열정은 누구보다 가장 좋았어요.',
      '수업 참여도도 매우 좋았어요.',
      '3학년 학생 중에서 선생님과 가장 많이 소통했어요.',
      '밥도 같이 먹어줬고, 정말 착하고 웃기며 많은 이야기를 나눠줬어요.',
    ],
  },
  {
    id: '3-1-김누리한', classId: '3-1', name: '김누리한', projectId: 'nugo', rating: 5, role: '팀 소통', status: 'published',
    notes: [
      '누리한이도 수업 참여도가 매우 좋았어요.',
      '리액션이 좋았어요.',
      '정말 웃겼어요.',
      '키가 엄청 커요.',
      '소통도 정말 많이 해줬고 역시 웃겼어요.',
      'UFC를 좋아해요.',
    ],
  },
  {
    id: '3-1-노정원', classId: '3-1', name: '노정원', projectId: 'nugo', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: ['정원이도 수업에 열심히 참여했어요.'],
  },
  {
    id: '3-1-박진우', classId: '3-1', name: '박진우', projectId: 'nugo', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: ['주변 친구들이 정말 잘 챙겨준 덕분에 진우도 열심히 참여했어요.'],
  },
  {
    id: '3-1-유원준', classId: '3-1', name: '유원준', projectId: 'nugo', rating: 5, role: '아이디어 지원', status: 'published',
    notes: [
      '원준이도 수업에 열심히 참여했어요.',
      '나라의 국기를 정말 잘 외우고 상식이 매우 뛰어났어요.',
    ],
  },
  {
    id: '3-1-정아영', classId: '3-1', name: '정아영', projectId: 'jego', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '재고 팀의 팀장을 맡았어요.',
      '옷을 골라주는 서비스를 높은 완성도로 완성했어요.',
      '팀원들과 열심히 참여했어요.',
      '프로젝트에 정말 열심히 참여했어요.',
      '리액션이 좋았어요.',
      '수업 참여도도 좋았어요.',
      '밥도 같이 먹어줬고, 정말 착하고 웃기며 많은 이야기를 나눠줬어요.',
    ],
  },
  {
    id: '3-1-강유지', classId: '3-1', name: '강유지', projectId: 'jego', rating: 5, role: '팀 소통', status: 'published',
    notes: [
      '유지도 수업 참여도가 좋았어요.',
      '리액션이 좋았어요.',
      '열심히 참여했어요.',
      '밥도 같이 먹어줬고, 정말 착하고 웃기며 많은 이야기를 나눠줬어요.',
    ],
  },
  {
    id: '3-1-김재현', classId: '3-1', name: '김재현', projectId: 'jego', rating: 5, role: '팀 소통', status: 'published',
    notes: [
      '수업 참여도가 좋았어요.',
      '리액션도 좋았어요.',
      '조금 시끄러울 때가 있었어요.',
      '열심히 참여했어요.',
      '정말 웃겼어요.',
      '탁구는 잘하지 못했어요.',
      '선생님과도 열심히 소통했어요.',
    ],
  },
  {
    id: '3-1-이채현', classId: '3-1', name: '이채현', projectId: 'jego', rating: 5, role: '발표', status: 'published',
    notes: [
      '리액션은 3학년 1반에서 단연 1등이었어요.',
      '열심히 참여했어요.',
      '프로젝트에도 열심히 참여했고 발표도 정말 잘했어요.',
      '밥도 같이 먹어줬고, 정말 착하고 웃기며 많은 이야기를 나눠줬어요.',
    ],
  },
  {
    id: '3-1-오가현', classId: '3-1', name: '오가현', projectId: 'gago', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '가고 팀의 팀장을 맡았어요.',
      '가고 싶은 곳을 고르는 앱 서비스 “여기가고”를 완성했어요.',
      '노트북을 담당했고 조용하지만 열심히 참여했어요.',
      'O/X 게임에서 두 번 연속 우승하며 모두를 놀라게 했어요.',
      '모든 팀을 통틀어 기능 명세서를 가장 열심히 작성한 팀이었어요.',
    ],
  },
  {
    id: '3-1-김다희', classId: '3-1', name: '김다희', projectId: 'gago', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: [
      '다희도 수업에 열심히 참여했어요.',
      '초반에는 조용했지만 5~7교시에는 훨씬 더 적극적으로 참여했어요.',
    ],
  },
  {
    id: '3-1-이예희', classId: '3-1', name: '이예희', projectId: 'gago', rating: 5, role: '기능 기획', status: 'published',
    notes: [
      '팀장은 아니었지만 리더처럼 팀을 이끌었어요.',
      '리액션이 좋았어요.',
      '열심히 참여했어요.',
      '프로젝트 참여도도 좋았어요.',
      '다양한 기능을 제안했어요.',
    ],
  },
  {
    id: '3-1-조민서', classId: '3-1', name: '조민서', projectId: 'gago', rating: 5, role: '기능 기획', status: 'published',
    notes: [
      '프로젝트에 정말 열심히 참여했어요.',
      '처음부터 끝까지 수업에 열심히 참여했어요.',
      '리액션이 좋았어요.',
      '질문을 많이 했어요.',
      '축구를 좋아해요.',
    ],
  },
  { id: '3-1-정상호', classId: '3-1', name: '정상호', notes: [], status: 'pending' },
  { id: '3-1-김해민', classId: '3-1', name: '김해민', notes: [], status: 'pending' },

  {
    id: '1-1-이다윤', classId: '1-1', name: '이다윤', projectId: 'wonji-cortis', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '팀장으로서 프로젝트에 열심히 참여했어요.',
      '질문도 하면서 프로젝트를 최대한 완성하는 데 집중했어요.',
      '오목 게임을 완성했어요.',
    ],
  },
  {
    id: '1-1-노강민', classId: '1-1', name: '노강민', projectId: 'wonji-cortis', rating: 5, role: '발표', status: 'published',
    notes: [
      '리액션과 소통을 반에서 가장 잘했어요.',
      '프로젝트 참여도도 좋았고 발표까지 맡아 정말 멋졌어요.',
      '강민이 덕분에 반 분위기가 한층 올라갔어요.',
    ],
  },
  {
    id: '1-1-심건우', classId: '1-1', name: '심건우', projectId: 'wonji-cortis', rating: 5, role: '아이디어 지원', status: 'published',
    notes: [
      '건우도 매우 똑똑했어요.',
      '나라 국기 맞히기를 좋아했어요.',
      '상식이 풍부했어요.',
      '수업에도 열심히 참여했어요.',
    ],
  },
  {
    id: '1-1-박지연', classId: '1-1', name: '박지연', projectId: 'wonji-cortis', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: [
      '열심히 참여한 것 같지만 눈에 잘 띄지는 않았어요.',
      '발표하러 나와서 강민이가 시키는 바람에 솔민이와 함께 춤출 뻔했어요.',
    ],
  },
  {
    id: '1-1-박솔민', classId: '1-1', name: '박솔민', projectId: 'wonji-cortis', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: ['솔민이도 지연이처럼 열심히 참여했고, 함께 춤출 뻔했던 순간이 기억에 남아요.'],
  },
  {
    id: '1-1-양희재', classId: '1-1', name: '양희재', projectId: 'yanggogi', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '양고기 팀의 팀장을 맡았어요.',
      '이 반의 무용왕이었어요.',
      '강민이와 함께 리액션과 소통, 수업 참여도 등 모든 면에서 1등이었어요.',
      '코르티스의 “RED RED” 춤을 추며 초반 분위기를 풀어줬어요.',
      '밸런스 게임 서비스를 완성했어요.',
    ],
  },
  {
    id: '1-1-권신영', classId: '1-1', name: '권신영', projectId: 'yanggogi', rating: 5, role: '기능 기획', status: 'published',
    notes: [
      '가끔 큰 소리를 내기도 했어요.',
      '수업 참여도가 높았어요.',
      '팀에서도 주도적으로 참여하는 편이었어요.',
    ],
  },
  {
    id: '1-1-김민혁', classId: '1-1', name: '김민혁', projectId: 'yanggogi', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: ['조용하지만 수업에 열심히 참여했던 것으로 기억해요.'],
  },
  {
    id: '1-1-우시연', classId: '1-1', name: '우시연', projectId: 'yanggogi', rating: 5, role: '기능 기획', status: 'published',
    notes: [
      '시연이도 신영이와 한 세트처럼 수업에 열심히 참여했어요.',
      '프로젝트에도 주도적으로 참여했어요.',
    ],
  },
  {
    id: '1-1-이성제', classId: '1-1', name: '이성제', projectId: 'yanggogi', rating: 5, role: '기능 기획', status: 'published',
    notes: [
      '기타를 잘 쳐요.',
      '은근히 수업에 열심히 참여했어요.',
      '내향적으로 보이지만 수업할 때 정말 열심히 하는 모습이 보였어요.',
      '질문도 많이 했어요.',
    ],
  },
  {
    id: '1-1-길효승', classId: '1-1', name: '길효승', projectId: 'hyogo', rating: 4.5, role: '팀 리더', status: 'published', isLeader: true,
    notes: ['팀장을 맡았지만 프로젝트에 아주 적극적으로 참여하는 느낌은 아니었어요.'],
  },
  {
    id: '1-1-정시훈', classId: '1-1', name: '정시훈', projectId: 'hyogo', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: ['시훈이도 정인이를 따라 열심히 하려는 모습이 보였어요.'],
  },
  {
    id: '1-1-김소율', classId: '1-1', name: '김소율', projectId: 'hyogo', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: [
      '소율이가 아파 보여서 걱정됐어요.',
      '그래도 수업에 열심히 참여했어요.',
      '아픈데도 수업에 열심히 참여하는 모습이 보기 좋았어요.',
    ],
  },
  {
    id: '1-1-이정인', classId: '1-1', name: '이정인', projectId: 'hyogo', rating: 5, role: '기능 실행', status: 'published',
    notes: [
      '초반에는 잠들어서 점수가 마이너스로 시작했지만, 수업이 진행될수록 달라졌어요.',
      '결국 팀에서 가장 열심히 참여했어요.',
      '정인이도 정말 웃겼어요.',
    ],
  },
  {
    id: '1-1-윤서진', classId: '1-1', name: '윤서진', projectId: 'hyogo', rating: 5, role: '기능 실행', status: 'published',
    notes: [
      '서진이가 사실상 팀장 역할을 자처했어요.',
      '노트북 작업과 프로젝트 참여도가 팀에서 가장 높았어요.',
      '숨은 그림 찾기 서비스 “숨은픽”을 완성했어요.',
    ],
  },
  {
    id: '1-1-문혜원', classId: '1-1', name: '문혜원', projectId: 'leaf', rating: 5, role: '팀 리더', status: 'published', isLeader: true,
    notes: [
      '팀장으로서 팀에서 프로젝트 참여도가 가장 높았고 리드하는 모습을 보여줬어요.',
      '발표도 열심히 했어요.',
      '감기에 걸렸는지 마스크를 쓰고 있었어요.',
      '헌터×헌터 게임을 완성했어요.',
    ],
  },
  {
    id: '1-1-김남우', classId: '1-1', name: '김남우', projectId: 'leaf', rating: 5, role: '멀티 플레이어', status: 'published',
    notes: [
      '수업 참여도가 정말 높았어요.',
      '정말 웃겼어요.',
      '팀에서도 열심히 활동했어요.',
      '프로젝트에도 열심히 참여했어요.',
      '가장 멀티플레이가 잘되는 학생이었어요.',
    ],
  },
  {
    id: '1-1-이태규', classId: '1-1', name: '이태규', projectId: 'leaf', rating: 4.5, role: '프로젝트 지원', status: 'published',
    notes: ['유일하게 선생님 기억에 선명하게 남지 않은 학생이에요.'],
  },
  {
    id: '1-1-고경현', classId: '1-1', name: '고경현', projectId: 'leaf', rating: 5, role: '팀 소통', status: 'published',
    notes: [
      '팀에서 리액션이 가장 좋았어요.',
      '수업 참여도도 정말 높았어요.',
      '소통도 잘했어요.',
      '경현이도 정말 웃겼어요.',
    ],
  },
  {
    id: '1-1-정유미', classId: '1-1', name: '정유미', projectId: 'leaf', rating: 5, role: '프로젝트 지원', status: 'published',
    notes: [
      '유미도 프로젝트와 수업에 열심히 참여한 것 같아요.',
      '다만 식사를 하지 않아서 걱정됐어요.',
      '원래 밥을 잘 먹지 않는다고 했어요.',
    ],
  },
]

export const classCommentaries: ClassCommentaryRecord[] = [
  {
    classId: '2-1',
    review: [
      '첫 수업이기도 했고, 선생님이 수업을 매끄럽게 주도하지 못했어요.',
      '그런데도 학생들이 전체적으로 정말 잘 따라와 줬어요.',
      '그래서 너무 감사해요.',
    ],
    mvps: [
      { label: '폭탄 머리 김유진', studentNames: ['김유진'] },
      { label: '도움 천재 연새봄', studentNames: ['연새봄'] },
      { label: '군기 반장 이송윤', studentNames: ['이송윤'] },
    ],
  },
  {
    classId: '2-2',
    review: [
      '두 번째 수업이라 이전 수업보다 진행이 훨씬 매끄러워졌어요.',
      '수업 참여도가 높았고 리액션도 좋았어요.',
    ],
    mvps: [
      { label: '소통왕 강지유', studentNames: ['강지유'] },
      { label: '싹싹함의 대명사 김민권', studentNames: ['김민권'] },
      { label: '틱톡커 조윤찬', studentNames: ['조윤찬'] },
    ],
  },
  {
    classId: '3-1',
    review: [
      '7교시까지 함께해서인지 가장 정이 많이 든 반이에요.',
      '모든 반 중 리액션이 가장 좋고, 소통도 잘하며 너무 웃기고 착한 반이었어요. 모든 게 만점이에요!',
    ],
    mvps: [
      { label: '3학년 전체', studentNames: ['정상호', '정아영', '이채현', '오가현', '조민서', '이예희', '김다희', '김재현', '강유지', '박진우', '노정원', '유원준', '김누리한', '김해민', '정수환'] },
    ],
  },
  {
    classId: '1-1',
    review: [
      '초반에는 리액션이 크지 않았지만 후반으로 갈수록 수업 참여도를 비롯한 모든 부분이 뛰어났어요.',
      '정말 재미있는 반이에요.',
      '가장 귀여운 반이에요.',
      '계속 챙겨주고 싶은 반이에요!',
    ],
    mvps: [],
  },
]

export function getClassCommentary(classId: PublishedClassId) {
  return classCommentaries.find((item) => item.classId === classId)
}

export function getStudentComments(classId: PublishedClassId) {
  return studentComments.filter((item) => item.classId === classId)
}
