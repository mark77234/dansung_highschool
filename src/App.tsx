import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Crown,
  ExternalLink,
  Heart,
  Image as ImageIcon,
  Instagram,
  LayoutGrid,
  Maximize2,
  MessageCircleMore,
  Minimize2,
  PenLine,
  Quote,
  School,
  Share2,
  Shuffle,
  Sparkles,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import {
  categoryLabels,
  classStudents,
  classes,
  getClass,
  getClassLabel,
  getPhoto,
  photoAsset,
  photos,
  projects,
  schedule,
  type ClassId,
  type ClassRecord,
  type PhotoCategory,
  type PhotoRecord,
  type ProjectRecord,
  type PublishedClassId,
  type StudentSeat,
} from './data/archive'
import {
  getClassCommentary,
  getStudentComments,
  studentComments,
  type StudentCommentRecord,
  type StudentRating,
} from './data/comments'

const STORAGE_KEY = 'dansung-memory:v1'
const HERO_PREVIEW_STORAGE_KEY = 'dansung-memory:hero-preview'

interface LocalMemory {
  likedPhotoIds: string[]
  savedPhotoIds: string[]
  lastClassId?: ClassId
}

const validClassIds = new Set(classes.map((item) => item.id))
const commentUrlPattern = /(https?:\/\/[^\s]+)/g

function readMemory(): LocalMemory {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<LocalMemory>
    return {
      likedPhotoIds: Array.isArray(value.likedPhotoIds) ? value.likedPhotoIds : [],
      savedPhotoIds: Array.isArray(value.savedPhotoIds) ? value.savedPhotoIds : [],
      lastClassId: value.lastClassId,
    }
  } catch {
    return { likedPhotoIds: [], savedPhotoIds: [] }
  }
}

const query = new URLSearchParams(window.location.search)
const queryPhoto = getPhoto(query.get('photo') ?? '')
const queryClass = query.get('class')
const initialClass = queryPhoto?.classId ?? (queryClass && validClassIds.has(queryClass as ClassId) ? queryClass as ClassId : null)

function pickHeroPreview(classId: PublishedClassId): PhotoRecord {
  const candidates = photos.filter((photo) => (
    photo.classId === classId && (photo.category === 'classroom' || photo.category === 'small-memory')
  ))
  const fallback = photos.find((photo) => photo.classId === classId)!

  try {
    const storageKey = `${HERO_PREVIEW_STORAGE_KEY}:${classId}`
    const previousId = sessionStorage.getItem(storageKey)
    const available = candidates.length > 1
      ? candidates.filter((photo) => photo.id !== previousId)
      : candidates
    const selected = available[Math.floor(Math.random() * available.length)] ?? fallback
    sessionStorage.setItem(storageKey, selected.id)
    return selected
  } catch {
    return candidates[Math.floor(Math.random() * candidates.length)] ?? fallback
  }
}

const heroPreviews = {
  first: pickHeroPreview('1-1'),
  second: pickHeroPreview('3-1'),
}

function App() {
  const initialMemory = useMemo(readMemory, [])
  const [selectedClassId, setSelectedClassId] = useState<ClassId | null>(initialClass)
  const [category, setCategory] = useState<PhotoCategory | 'all'>('all')
  const [liked, setLiked] = useState(() => new Set(initialMemory.likedPhotoIds))
  const [saved, setSaved] = useState(() => new Set(initialMemory.savedPhotoIds))
  const [showAlbum, setShowAlbum] = useState(false)
  const [activePhotoId, setActivePhotoId] = useState<string | null>(queryPhoto?.id ?? null)
  const [activeStudentCommentId, setActiveStudentCommentId] = useState<string | null>(null)
  const [zoomed, setZoomed] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const contentRef = useRef<HTMLElement>(null)
  const classesRef = useRef<HTMLElement>(null)
  const scrollProgressRef = useRef<HTMLDivElement>(null)
  const photoCloseButtonRef = useRef<HTMLButtonElement>(null)
  const commentCloseButtonRef = useRef<HTMLButtonElement>(null)
  const commentPanelRef = useRef<HTMLElement>(null)
  const commentTriggerRef = useRef<HTMLButtonElement | null>(null)
  const touchStart = useRef<number | null>(null)

  const activeClass = classes.find((item) => item.id === selectedClassId) ?? null
  const classPhotos = selectedClassId ? photos.filter((photo) => photo.classId === selectedClassId) : []
  const classProjects = selectedClassId ? projects.filter((project) => project.classId === selectedClassId) : []
  const savedPhotos = photos.filter((photo) => saved.has(photo.id))
  const visiblePhotos = showAlbum
    ? savedPhotos
    : classPhotos.filter((photo) => category === 'all' || photo.category === category)
  const viewerPool = showAlbum ? savedPhotos : classPhotos.length ? classPhotos : photos
  const activePhoto = activePhotoId ? getPhoto(activePhotoId) : undefined
  const activeIndex = activePhoto ? viewerPool.findIndex((photo) => photo.id === activePhoto.id) : -1
  const studentCommentPool = activeClass?.status === 'published'
    ? getStudentComments(activeClass.id as PublishedClassId).filter((item) => item.status === 'published')
    : []
  const activeStudentComment = activeStudentCommentId
    ? studentComments.find((item) => item.id === activeStudentCommentId && item.status === 'published')
    : undefined
  const activeStudentCommentIndex = activeStudentComment
    ? studentCommentPool.findIndex((item) => item.id === activeStudentComment.id)
    : -1
  const activeStudentProject = activeStudentComment?.projectId
    ? projects.find((project) => project.id === activeStudentComment.projectId)
    : undefined
  const activeStudentCommentary = activeStudentComment ? getClassCommentary(activeStudentComment.classId) : undefined
  const activeStudentMvpLabels = activeStudentCommentary?.mvps
    .filter((mvp) => mvp.studentNames.includes(activeStudentComment?.name ?? ''))
    .map((mvp) => mvp.label) ?? []

  useEffect(() => {
    const payload: LocalMemory = {
      likedPhotoIds: [...liked],
      savedPhotoIds: [...saved],
      lastClassId: selectedClassId ?? undefined,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Private browsing can disable storage; the session still works.
    }
  }, [liked, saved, selectedClassId])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (selectedClassId) url.searchParams.set('class', selectedClassId)
    else url.searchParams.delete('class')
    if (activePhotoId) url.searchParams.set('photo', activePhotoId)
    else url.searchParams.delete('photo')
    window.history.replaceState({}, '', url)
  }, [selectedClassId, activePhotoId])

  useEffect(() => {
    if (!activePhoto) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setZoomed(false)
    window.setTimeout(() => photoCloseButtonRef.current?.focus(), 20)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePhotoId(null)
      if (event.key === 'ArrowLeft') stepPhoto(-1)
      if (event.key === 'ArrowRight') stepPhoto(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activePhoto?.id, viewerPool.length])

  useEffect(() => {
    if (!activeStudentComment) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => commentCloseButtonRef.current?.focus(), 20)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeStudentComment()
      if (event.key === 'ArrowLeft') stepStudentComment(-1)
      if (event.key === 'ArrowRight') stepStudentComment(1)
      if (event.key !== 'Tab') return

      const focusable = Array.from(commentPanelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]') ?? [])
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeStudentComment?.id, studentCommentPool.length])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const progress = scrollProgressRef.current
    if (!progress) return
    let frame = 0
    const updateProgress = () => {
      frame = 0
      const available = document.documentElement.scrollHeight - window.innerHeight
      const ratio = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0
      progress.style.transform = `scaleX(${ratio})`
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress)
    }
    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => { element.dataset.visible = 'true' })
      return
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        ;(entry.target as HTMLElement).dataset.visible = entry.isIntersecting ? 'true' : 'false'
      }
    }, { threshold: 0.12, rootMargin: '-5% 0px -5%' })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [selectedClassId, showAlbum, category, visiblePhotos.length])

  function chooseClass(classRecord: ClassRecord) {
    setActiveStudentCommentId(null)
    setSelectedClassId(classRecord.id)
    setShowAlbum(false)
    setCategory('all')
    window.setTimeout(() => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function showMyAlbum() {
    setShowAlbum(true)
    setActivePhotoId(null)
    setActiveStudentCommentId(null)
    window.setTimeout(() => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function toggleSet(id: string, setter: React.Dispatch<React.SetStateAction<Set<string>>>, message: string) {
    setter((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else {
        next.add(id)
        setToast(message)
      }
      return next
    })
  }

  function openPhoto(photo: PhotoRecord) {
    setActiveStudentCommentId(null)
    setSelectedClassId(photo.classId)
    setActivePhotoId(photo.id)
  }

  function openStudentComment(comment: StudentCommentRecord, trigger: HTMLButtonElement) {
    commentTriggerRef.current = trigger
    setActivePhotoId(null)
    setActiveStudentCommentId(comment.id)
  }

  function closeStudentComment() {
    setActiveStudentCommentId(null)
    window.setTimeout(() => commentTriggerRef.current?.focus(), 20)
  }

  function stepStudentComment(direction: -1 | 1) {
    if (!studentCommentPool.length) return
    const currentIndex = Math.max(0, studentCommentPool.findIndex((item) => item.id === activeStudentCommentId))
    const nextIndex = (currentIndex + direction + studentCommentPool.length) % studentCommentPool.length
    setActiveStudentCommentId(studentCommentPool[nextIndex].id)
  }

  function randomMemory() {
    const candidates = activePhoto ? photos.filter((photo) => photo.id !== activePhoto.id) : photos
    const randomPhoto = candidates[Math.floor(Math.random() * candidates.length)]
    setShowAlbum(false)
    setActiveStudentCommentId(null)
    setSelectedClassId(randomPhoto.classId)
    setActivePhotoId(randomPhoto.id)
  }

  function stepPhoto(direction: -1 | 1) {
    if (!viewerPool.length) return
    const currentIndex = Math.max(0, viewerPool.findIndex((photo) => photo.id === activePhotoId))
    const nextIndex = (currentIndex + direction + viewerPool.length) % viewerPool.length
    setActivePhotoId(viewerPool[nextIndex].id)
  }

  async function sharePhoto() {
    if (!activePhoto) return
    const shareData = {
      title: `${activePhoto.title} · 그 여름, 단성고에서`,
      text: activePhoto.caption,
      url: window.location.href,
    }
    try {
      if (navigator.share) await navigator.share(shareData)
      else {
        await navigator.clipboard.writeText(window.location.href)
        setToast('사진 링크를 복사했어요')
      }
    } catch (error) {
      if ((error as DOMException).name !== 'AbortError') setToast('공유하지 못했어요')
    }
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (touchStart.current === null || zoomed) return
    const distance = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(distance) > 55) stepPhoto(distance > 0 ? -1 : 1)
    touchStart.current = null
  }

  return (
    <div className="site-shell">
      <div className="scroll-progress" ref={scrollProgressRef} aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="처음으로 이동">
          <img src="/dansung-logo.png" alt="단성고등학교" />
        </a>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          <button onClick={() => classesRef.current?.scrollIntoView({ behavior: 'smooth' })}>반 선택</button>
          <button onClick={randomMemory}><Shuffle size={17} /> 랜덤 추억</button>
          <button onClick={showMyAlbum}><Bookmark size={17} /> 내 앨범 <span>{saved.size}</span></button>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy" data-reveal="up">
            <div className="eyebrow"><Sparkles size={16} /> DANSUNG CODING DAYS</div>
            <h1 id="hero-title">그 여름,<br /><em>단성고에서</em></h1>
            <p className="hero-description">바이브코딩과 파이썬으로 함께 만든<br className="mobile-only" /> 우리의 기록</p>
            <div className="date-ticket">
              <CalendarDays size={20} />
              <span>2026.07.13</span><i /> <span>07.16</span>
            </div>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => classesRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                우리 반 찾아보기 <ArrowRight size={20} />
              </button>
              <button className="round-button" onClick={randomMemory} aria-label="랜덤 추억 열기"><Shuffle size={21} /></button>
            </div>
          </div>

          <div className="hero-film" aria-label="수업 사진 미리보기" data-reveal="right">
            <div className="film-label"><span>REC</span> JULY 2026</div>
            <button
              className="film-photo film-photo-one"
              data-photo-id={heroPreviews.first.id}
              onClick={() => openPhoto(heroPreviews.first)}
              aria-label={`1학년 1반 ${heroPreviews.first.title} 사진 크게 보기`}
            >
              <img src={photoAsset(heroPreviews.first)} alt={heroPreviews.first.alt} fetchPriority="high" />
              <span>1학년 1반 · {heroPreviews.first.title}</span>
            </button>
            <button
              className="film-photo film-photo-two"
              data-photo-id={heroPreviews.second.id}
              onClick={() => openPhoto(heroPreviews.second)}
              aria-label={`3학년 1반 ${heroPreviews.second.title} 사진 크게 보기`}
            >
              <img src={photoAsset(heroPreviews.second)} alt={heroPreviews.second.alt} />
              <span>3학년 1반 · {heroPreviews.second.title}</span>
            </button>
            <div className="tape tape-one" />
            <div className="scribble">2026 코딩<br />수업 기록 ↗</div>
          </div>
        </section>

        <section className="date-strip" aria-label="날짜별 수업 일정">
          {schedule.map((item, index) => {
            const classRecord = getClass(item.classId)!
            const active = selectedClassId === item.classId && !showAlbum
            return (
              <button
                key={item.date}
                className={`date-cell ${item.status === 'upcoming' ? 'next' : ''} ${active ? 'active' : ''}`}
                onClick={() => chooseClass(classRecord)}
                aria-pressed={active}
                data-reveal={index % 2 ? 'down' : 'up'}
                style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
              >
                <span>DAY {index + 1}</span>
                <strong>{item.date}</strong>
                <b>{classRecord.label}</b>
                <small>{item.status === 'completed' ? '수업 완료' : '수업 예정'}</small>
              </button>
            )
          })}
        </section>

        <section className="classes-section" ref={classesRef} aria-labelledby="classes-title">
          <div className="section-heading" data-reveal="up">
            <div><span className="section-kicker">CHOOSE YOUR CLASS</span><h2 id="classes-title">반별 수업 기록</h2></div>
            <p>반을 선택하면 팀 프로젝트, 좌석배치도,<br />수업 사진을 한 번에 볼 수 있습니다.</p>
          </div>
          <div className="class-grid">
            {classes.map((classRecord, index) => (
              <ClassCard
                key={classRecord.id}
                classRecord={classRecord}
                index={index}
                active={selectedClassId === classRecord.id && !showAlbum}
                onClick={() => chooseClass(classRecord)}
              />
            ))}
          </div>
        </section>

        <section className="memory-content" ref={contentRef} aria-live="polite">
          {showAlbum ? (
            <AlbumView photos={savedPhotos} liked={liked} saved={saved} onOpen={openPhoto} onLike={(id) => toggleSet(id, setLiked, '좋아요를 남겼어요')} onSave={(id) => toggleSet(id, setSaved, '내 앨범에 담았어요')} onChooseClass={() => classesRef.current?.scrollIntoView({ behavior: 'smooth' })} />
          ) : activeClass ? (
            activeClass.status === 'published' ? (
              <PublishedClass
                classRecord={activeClass}
                classPhotos={classPhotos}
                classProjects={classProjects}
                visiblePhotos={visiblePhotos}
                category={category}
                liked={liked}
                saved={saved}
                onCategory={setCategory}
                onOpen={openPhoto}
                onOpenStudent={openStudentComment}
                onLike={(id) => toggleSet(id, setLiked, '좋아요를 남겼어요')}
                onSave={(id) => toggleSet(id, setSaved, '내 앨범에 담았어요')}
              />
            ) : <PlaceholderClass classRecord={activeClass} onChoose={() => classesRef.current?.scrollIntoView({ behavior: 'smooth' })} />
          ) : (
            <div className="choose-prompt" data-reveal="up">
              <div className="prompt-icon"><School size={28} /></div>
              <span>CLASS ARCHIVE</span>
              <h2>확인할 반을<br />선택해 주세요.</h2>
              <button className="secondary-button" onClick={() => classesRef.current?.scrollIntoView({ behavior: 'smooth' })}>반 선택하기 <ArrowRight size={18} /></button>
            </div>
          )}
        </section>

        <CreatorSection />
      </main>

      <footer className="footer">
        <img src="/dansung-logo.png" alt="단성고등학교" />
        <p>2026 단성고 코딩 수업 추억 아카이브</p>
        <a href="https://www.instagram.com/bong_chanii" target="_blank" rel="noreferrer">Made by 바이브코더 병찬쌤 · @bong_chanii</a>
      </footer>

      <nav className="mobile-nav" aria-label="모바일 메뉴">
        <button onClick={() => classesRef.current?.scrollIntoView({ behavior: 'smooth' })}><LayoutGrid /><span>반 선택</span></button>
        <button className="random-nav" onClick={randomMemory}><Shuffle /><span>랜덤 추억</span></button>
        <button onClick={showMyAlbum}><Bookmark /><span>내 앨범</span>{saved.size > 0 && <b>{saved.size}</b>}</button>
      </nav>

      {activePhoto && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${activePhoto.title} 사진 크게 보기`}>
          <div className="lightbox-backdrop" onClick={() => setActivePhotoId(null)} />
          <div className="lightbox-toolbar">
            <span>{Math.max(1, activeIndex + 1)} / {viewerPool.length}</span>
            <div>
              <button onClick={() => setZoomed((value) => !value)} aria-label={zoomed ? '사진 축소' : '사진 확대'}>{zoomed ? <Minimize2 /> : <Maximize2 />}</button>
              <button onClick={sharePhoto} aria-label="사진 공유"><Share2 /></button>
              <button ref={photoCloseButtonRef} onClick={() => setActivePhotoId(null)} aria-label="사진 닫기"><X /></button>
            </div>
          </div>
          <div
            className={`lightbox-stage ${zoomed ? 'is-zoomed' : ''}`}
            onTouchStart={(event) => { touchStart.current = event.touches[0].clientX }}
            onTouchEnd={onTouchEnd}
          >
            <button className="lightbox-arrow prev" onClick={() => stepPhoto(-1)} aria-label="이전 사진"><ChevronLeft /></button>
            <img src={photoAsset(activePhoto, 'large')} alt={activePhoto.alt} onDoubleClick={() => setZoomed((value) => !value)} />
            <button className="lightbox-arrow next" onClick={() => stepPhoto(1)} aria-label="다음 사진"><ChevronRight /></button>
          </div>
          <div className="lightbox-caption">
            <div><span>{getClassLabel(activePhoto.classId)} · {categoryLabels[activePhoto.category]}</span><h2>{activePhoto.title}</h2><p>{activePhoto.caption}</p></div>
            <div className="lightbox-actions">
              <button className={liked.has(activePhoto.id) ? 'active like' : 'like'} onClick={() => toggleSet(activePhoto.id, setLiked, '좋아요를 남겼어요')} aria-label="좋아요"><Heart fill={liked.has(activePhoto.id) ? 'currentColor' : 'none'} /></button>
              <button className={saved.has(activePhoto.id) ? 'active' : ''} onClick={() => toggleSet(activePhoto.id, setSaved, '내 앨범에 담았어요')} aria-label="내 앨범에 저장"><Bookmark fill={saved.has(activePhoto.id) ? 'currentColor' : 'none'} /></button>
            </div>
          </div>
        </div>
      )}

      {activeStudentComment && (
        <div className="student-comment-dialog" role="dialog" aria-modal="true" aria-labelledby="student-comment-dialog-title">
          <div className="student-comment-backdrop" onClick={closeStudentComment} />
          <article className="student-comment-panel" ref={commentPanelRef}>
            <div className="student-comment-toolbar">
              <span>{Math.max(1, activeStudentCommentIndex + 1)} / {studentCommentPool.length}</span>
              <div>
                <button onClick={() => stepStudentComment(-1)} aria-label="이전 학생 코멘트"><ChevronLeft /></button>
                <button onClick={() => stepStudentComment(1)} aria-label="다음 학생 코멘트"><ChevronRight /></button>
                <button ref={commentCloseButtonRef} onClick={closeStudentComment} aria-label="학생 코멘트 닫기"><X /></button>
              </div>
            </div>
            <div className="student-comment-scroll">
              <div className="student-comment-identity">
                <div className="student-comment-avatar" aria-hidden="true">{activeStudentComment.name.slice(0, 1)}</div>
                <div>
                  <span>{getClassLabel(activeStudentComment.classId)} · {activeStudentProject?.teamName ?? '프로젝트 팀'}</span>
                  <h2 id="student-comment-dialog-title">{activeStudentComment.name}</h2>
                  <p>{activeStudentComment.role}</p>
                </div>
              </div>
              <div className="student-comment-badges">
                {activeStudentComment.isLeader && <span className="leader"><Crown /> 팀장</span>}
                {activeStudentMvpLabels.map((label) => <span className="mvp" key={label}><Trophy /> {label}</span>)}
                {activeStudentProject?.serviceName && <span>{activeStudentProject.serviceName}</span>}
              </div>
              <div className="student-comment-rating">
                <RatingStars rating={activeStudentComment.rating!} />
                <strong>{activeStudentComment.rating} / 5</strong>
              </div>
              <div className="student-comment-letter">
                <span><MessageCircleMore /> 병찬쌤이 남긴 한마디</span>
                <ol>
                  {activeStudentComment.notes.map((note, index) => (
                    <li key={`${activeStudentComment.id}-${index}`}><i>{String(index + 1).padStart(2, '0')}</i><CommentNote text={note} /></li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="student-comment-footer">
              <button onClick={() => stepStudentComment(-1)}><ChevronLeft /> 이전 학생</button>
              <span>한 명 한 명, 모두 기억할게요.</span>
              <button onClick={() => stepStudentComment(1)}>다음 학생 <ChevronRight /></button>
            </div>
          </article>
        </div>
      )}

      {toast && <div className="toast" role="status"><Check size={18} /> {toast}</div>}
    </div>
  )
}

function ClassCard({ classRecord, index, active, onClick }: { classRecord: ClassRecord; index: number; active: boolean; onClick: () => void }) {
  const photo = classRecord.heroPhotoId ? getPhoto(classRecord.heroPhotoId) : undefined
  const count = photos.filter((item) => item.classId === classRecord.id).length
  return (
    <button
      className={`class-card status-${classRecord.status} ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{ '--accent': classRecord.accent, '--reveal-delay': `${index * 60}ms` } as React.CSSProperties}
      aria-pressed={active}
      data-reveal={index % 2 ? 'up' : 'left'}
    >
      {photo && <img src={photoAsset(photo)} alt="" loading="lazy" />}
      <div className="class-overlay" />
      <span className="class-index">0{index + 1}</span>
      <span className="class-status">
        {classRecord.status === 'published' ? `${count} MEMORIES` : classRecord.status === 'upcoming' ? <><Clock3 size={14} /> 곧 업데이트</> : '함께하지 못했어요'}
      </span>
      <div className="class-copy"><small>{classRecord.kicker}</small><h3>{classRecord.label}</h3><p>{classRecord.course}</p></div>
      <span className="class-arrow"><ArrowRight /></span>
    </button>
  )
}

function PlaceholderClass({ classRecord, onChoose }: { classRecord: ClassRecord; onChoose: () => void }) {
  const upcoming = classRecord.status === 'upcoming'
  return (
    <div className={`placeholder-class ${upcoming ? 'upcoming' : 'missed'}`} style={{ '--accent': classRecord.accent } as React.CSSProperties} data-reveal="up">
      <div className="placeholder-stamp">{upcoming ? '07.16 · COMING SOON' : 'UNTIL NEXT TIME'}</div>
      <div className="placeholder-icon">{upcoming ? <Clock3 size={42} /> : <Heart size={42} />}</div>
      <span>{classRecord.label}</span>
      <h2>{upcoming ? <>7월 16일 수업 후<br />업데이트됩니다.</> : <>이번에는 수업을<br />진행하지 못했습니다.</>}</h2>
      <p>{classRecord.summary}</p>
      <button className="secondary-button" onClick={onChoose}>다른 반 둘러보기 <ArrowRight size={18} /></button>
      <div className="placeholder-lines" aria-hidden="true"><i /><i /><i /></div>
    </div>
  )
}

function PublishedClass({
  classRecord, classPhotos, classProjects, visiblePhotos, category, liked, saved, onCategory, onOpen, onOpenStudent, onLike, onSave,
}: {
  classRecord: ClassRecord
  classPhotos: PhotoRecord[]
  classProjects: ProjectRecord[]
  visiblePhotos: PhotoRecord[]
  category: PhotoCategory | 'all'
  liked: Set<string>
  saved: Set<string>
  onCategory: (category: PhotoCategory | 'all') => void
  onOpen: (photo: PhotoRecord) => void
  onOpenStudent: (comment: StudentCommentRecord, trigger: HTMLButtonElement) => void
  onLike: (id: string) => void
  onSave: (id: string) => void
}) {
  const seatPhoto = classPhotos.find((photo) => photo.category === 'seat')
  const students = classStudents[classRecord.id as PublishedClassId] ?? []
  const heroPhoto = classRecord.heroPhotoId ? getPhoto(classRecord.heroPhotoId) : undefined
  return (
    <div className="published-class" style={{ '--accent': classRecord.accent } as React.CSSProperties}>
      <header className="class-hero" data-reveal="up">
        {heroPhoto && <img className="class-hero-photo" src={photoAsset(heroPhoto, 'large')} alt="" />}
        <div className="class-hero-scrim" aria-hidden="true" />
        <div className="class-overview"><span>{classRecord.kicker}</span><h2>{classRecord.label}</h2><p>{classRecord.summary}</p></div>
        <div className="class-stats"><div><strong>{classProjects.length}</strong><span>TEAMS</span></div><div><strong>{students.length}</strong><span>STUDENTS</span></div><div><strong>{classPhotos.length}</strong><span>MEMORIES</span></div></div>
      </header>

      <section className="projects-section" aria-labelledby="projects-title">
        <div className="subheading" data-reveal="up"><div><span>01 · PROJECTS</span><h3 id="projects-title">팀 프로젝트</h3></div><p>각 팀의 기획서와 현재 확인 가능한<br />결과물을 정리했습니다.</p></div>
        <div className={`project-grid ${classProjects.length === 4 ? 'four-up' : ''}`}>
          {classProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={onOpen} />)}
        </div>
        <p className="project-link-notice"><ExternalLink size={15} /> 배포된 작품은 체험 기간이나 호스팅 상태에 따라 접속이 제한될 수 있습니다.</p>
      </section>

      {seatPhoto && (
        <section className="seat-feature" aria-labelledby="seat-title" data-reveal="left">
          <button className="seat-image" onClick={() => onOpen(seatPhoto)}><img src={photoAsset(seatPhoto)} alt={seatPhoto.alt} loading="lazy" /><span><Maximize2 /> 크게 보기</span></button>
          <div className="seat-copy"><span>02 · CLASSPILOT</span><h3 id="seat-title">ClassPilot<br />좌석배치도</h3><p>병찬쌤이 만든 ClassPilot으로 기록한 실제 좌석배치도입니다. 원본 화면에서 학생 이름과 자리도 함께 확인할 수 있습니다.</p><button onClick={() => onOpen(seatPhoto)}>원본 크게 보기 <ArrowRight size={18} /></button></div>
        </section>
      )}

      <ClassRoster classRecord={classRecord} students={students} />

      <TeacherMessage />
      <StudentComments classRecord={classRecord} students={students} classProjects={classProjects} onOpen={onOpenStudent} />

      <section className="gallery-section" aria-labelledby="gallery-title">
        <div className="subheading gallery-heading" data-reveal="up"><div><span>06 · PHOTO ARCHIVE</span><h3 id="gallery-title">수업 사진<br />{classPhotos.length}장</h3></div><p>사진을 누르면 크게 볼 수 있습니다.<br />북마크한 사진은 내 앨범에 저장됩니다.</p></div>
        <div className="filter-row" role="group" aria-label="사진 분류" data-reveal="up">
          {(Object.keys(categoryLabels) as Array<PhotoCategory | 'all'>).map((key) => (
            <button key={key} className={category === key ? 'active' : ''} onClick={() => onCategory(key)}>{categoryLabels[key]}</button>
          ))}
        </div>
        <PhotoGrid photos={visiblePhotos} liked={liked} saved={saved} onOpen={onOpen} onLike={onLike} onSave={onSave} />
      </section>
    </div>
  )
}

function TeacherMessage() {
  return (
    <section className="teacher-message" aria-labelledby="teacher-message-title" data-reveal="up">
      <div className="teacher-message-mark" aria-hidden="true"><Quote size={34} /></div>
      <div className="teacher-message-copy">
        <span>04 · 병찬쌤의 후기</span>
        <h3 id="teacher-message-title">또 보고 싶은<br />단성고 학생들에게</h3>
        <blockquote>
          너무 착하고 순하고, 가식 없이 순수하면서도 멋지고 예쁘고 잘생기기까지 다 하는 단성고 학생들. 짧은 수업이었지만 함께 웃고 고민하던 시간이 오래 기억에 남을 것 같아요. 벌써 또 보고 싶다!
        </blockquote>
        <div className="teacher-message-sign"><Heart size={18} fill="currentColor" /><span>바이브코더 병찬쌤</span></div>
      </div>
      <div className="teacher-message-words" aria-hidden="true">
        <span>착하고</span><span>순수하고</span><span>멋지고</span><span>예쁘고</span><span>잘생기고</span><strong>다 하는 단성고!</strong>
      </div>
    </section>
  )
}

function RatingStars({ rating }: { rating: StudentRating }) {
  return (
    <span className="rating-stars" role="img" aria-label={`5점 만점에 ${rating}점`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <span key={index} style={{ '--star-fill': Math.min(1, Math.max(0, rating - index)) } as React.CSSProperties}>★</span>
      ))}
    </span>
  )
}

function CommentNote({ text }: { text: string }) {
  return (
    <p>
      {text.split(commentUrlPattern).map((part, index) => part.startsWith('http')
        ? <a href={part} target="_blank" rel="noreferrer" key={`${part}-${index}`}>{part}</a>
        : part)}
    </p>
  )
}

function StudentCommentCard({
  comment, isMvp, index, onOpen,
}: {
  comment: StudentCommentRecord
  isMvp: boolean
  index: number
  onOpen: (comment: StudentCommentRecord, trigger: HTMLButtonElement) => void
}) {
  if (comment.status === 'pending') {
    return (
      <article className="student-comment-card pending" style={{ '--comment-delay': `${index * 34}ms` } as React.CSSProperties}>
        <span className="student-comment-card-avatar">{comment.name.slice(0, 1)}</span>
        <div><span>코멘트 준비 중</span><h5>{comment.name}</h5><p>조금만 기다려 주세요.</p></div>
        {isMvp && <i className="student-card-mvp"><Trophy /> MVP</i>}
      </article>
    )
  }

  return (
    <button
      className="student-comment-card"
      onClick={(event) => onOpen(comment, event.currentTarget)}
      style={{ '--comment-delay': `${index * 34}ms` } as React.CSSProperties}
      aria-label={`${comment.name} 학생 코멘트 전체 읽기`}
    >
      <span className="student-comment-card-avatar">{comment.name.slice(0, 1)}</span>
      <div className="student-comment-card-copy">
        <span>{comment.role}</span>
        <h5>{comment.name}</h5>
        <div><RatingStars rating={comment.rating!} /><strong>{comment.rating}</strong></div>
      </div>
      <div className="student-comment-card-badges">
        {comment.isLeader && <i className="leader"><Crown /> 팀장</i>}
        {isMvp && <i className="mvp"><Trophy /> MVP</i>}
      </div>
      <span className="student-comment-card-open"><MessageCircleMore /><b>{comment.notes.length}</b><ArrowRight /></span>
    </button>
  )
}

function StudentComments({
  classRecord, students, classProjects, onOpen,
}: {
  classRecord: ClassRecord
  students: StudentSeat[]
  classProjects: ProjectRecord[]
  onOpen: (comment: StudentCommentRecord, trigger: HTMLButtonElement) => void
}) {
  const comments = getStudentComments(classRecord.id as PublishedClassId)
  const commentary = getClassCommentary(classRecord.id as PublishedClassId)
  const publishedCount = comments.filter((item) => item.status === 'published').length
  const pendingComments = comments.filter((item) => item.status === 'pending')
  const mvpNames = new Set(commentary?.mvps.flatMap((mvp) => mvp.studentNames) ?? [])

  return (
    <section className="future-comments" aria-labelledby="future-comments-title" data-reveal="up">
      <div className="future-comments-heading">
        <div><span>05 · ONE BY ONE</span><h3 id="future-comments-title">병찬쌤이 남긴<br />한마디</h3></div>
        <p><PenLine size={18} /> 함께 만든 프로젝트와 수업 속 모습을<br />한 명 한 명에게 편지처럼 남겼어요.</p>
      </div>

      <div className="student-comment-teams">
        {classProjects.map((project, teamIndex) => {
          const teamComments = comments.filter((item) => item.projectId === project.id)
          if (!teamComments.length) return null
          return (
            <section className="student-comment-team" key={project.id} aria-labelledby={`comment-team-${project.id}`} data-reveal={teamIndex % 2 ? 'right' : 'left'}>
              <header>
                <span>{String(teamIndex + 1).padStart(2, '0')} · TEAM</span>
                <div><h4 id={`comment-team-${project.id}`}>{project.teamName}</h4><p>{project.serviceName ?? project.topic} · {teamComments.length}명</p></div>
              </header>
              <div className="student-comment-grid">
                {teamComments.map((comment, index) => (
                  <StudentCommentCard key={comment.id} comment={comment} isMvp={mvpNames.has(comment.name)} index={index} onOpen={onOpen} />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {pendingComments.length > 0 && (
        <section className="pending-comment-group" aria-labelledby="pending-comment-title">
          <div><span>STILL WRITING</span><h4 id="pending-comment-title">코멘트 준비 중</h4></div>
          <div className="student-comment-grid pending-grid">
            {pendingComments.map((comment, index) => (
              <StudentCommentCard key={comment.id} comment={comment} isMvp={mvpNames.has(comment.name)} index={index} onOpen={onOpen} />
            ))}
          </div>
        </section>
      )}

      {commentary && (
        <div className="class-commentary" data-reveal="up">
          <div className="class-review-card">
            <span>병찬쌤의 {classRecord.label} 총평</span>
            <h4>함께한 하루를<br />돌아보며</h4>
            <ul>{commentary.review.map((review) => <li key={review}>{review}</li>)}</ul>
          </div>
          {commentary.mvps.length > 0 && (
            <div className="class-mvp-card">
              <span><Trophy /> CLASS MVP</span>
              <h4>이 반의<br />빛나는 이름</h4>
              <div>{commentary.mvps.map((mvp) => <strong key={mvp.label}>{mvp.label}</strong>)}</div>
            </div>
          )}
        </div>
      )}

      <div className={`comment-completion ${publishedCount === students.length ? 'complete' : ''}`}>
        <span>{publishedCount === students.length ? 'ALL LETTERS ARRIVED' : 'TO BE CONTINUED'}</span>
        <strong>{publishedCount === students.length ? '모든 한마디가 도착했어요' : `${publishedCount}/${students.length}명 작성 완료`}</strong>
        <p>{publishedCount === students.length ? '한 명 한 명의 반짝였던 순간을 오래 기억할게요.' : `${students.length - publishedCount}명의 이야기도 계속 준비하고 있어요.`}</p>
        <i />
      </div>
    </section>
  )
}

function ClassRoster({ classRecord, students }: { classRecord: ClassRecord; students: StudentSeat[] }) {
  return (
    <section className="roster-section" aria-labelledby={`roster-${classRecord.id}`} data-reveal="right">
      <div className="roster-heading">
        <div>
          <span>03 · CLASS ROSTER</span>
          <h3 id={`roster-${classRecord.id}`}>{classRecord.label} 학생 명단</h3>
        </div>
        <p><Users size={18} /> 좌석배치도 기준 {students.length}명</p>
      </div>

      <div className="classroom-board-scroll" tabIndex={0} aria-label={`${classRecord.label} 좌석 배치. 좌우로 스크롤할 수 있습니다.`}>
        <div className="classroom-board">
          <div className="board-front">칠판 · 교실 앞</div>
          {students.map((student, index) => (
            <div
              className="student-seat"
              key={student.name}
              style={{
                gridColumn: student.column,
                gridRow: student.row + 1,
                '--seat-delay': `${index * 35}ms`,
              } as React.CSSProperties}
            >
              <span>{student.name}</span>
            </div>
          ))}
          <div className="teacher-seat"><School size={17} /><span>선생님</span></div>
          <div className="board-back">교실 뒤</div>
        </div>
      </div>

      <div className="student-list" aria-label={`${classRecord.label} 전체 학생 이름`}>
        {students.map((student, index) => (
          <span key={student.name} style={{ '--seat-delay': `${index * 30}ms` } as React.CSSProperties}>{student.name}</span>
        ))}
      </div>
      <p className="roster-note">ClassPilot 화면을 기준으로 이름과 상대적인 좌석 위치를 옮겼습니다.</p>
    </section>
  )
}

function ProjectCard({ project, index, onOpen }: { project: ProjectRecord; index: number; onOpen: (photo: PhotoRecord) => void }) {
  const cover = getPhoto(project.coverPhotoId)!
  const statusLabel = project.status === 'live' ? 'LIVE NOW' : project.status === 'deleted' ? '삭제된 프로젝트' : project.status === 'build-failed' ? '빌드 실패' : '사진으로 남은 기록'
  return (
    <article className="project-card" data-reveal={index % 2 ? 'right' : 'left'} style={{ '--reveal-delay': `${(index % 3) * 70}ms` } as React.CSSProperties}>
      <button className="project-cover" onClick={() => onOpen(cover)} aria-label={`${project.serviceName ?? project.teamName} 프로젝트 사진 크게 보기`}>
        <img src={photoAsset(cover)} alt={cover.alt} loading="lazy" />
        <span className={`project-badge status-${project.status}`}>{project.status === 'live' && <i />} {statusLabel}</span>
        <span className="project-zoom"><Maximize2 /></span>
      </button>
      <div className="project-body">
        <span className="project-topic">{project.topic}</span>
        <h4>{project.teamName}</h4>
        {project.previousName && <p className="rename-note">{project.previousName} → 지금의 이름</p>}
        {project.serviceName && <p className="service-name"><span>서비스</span><strong>{project.serviceName}</strong></p>}
        <dl><div><dt>팀장</dt><dd>{project.leader}</dd></div>{project.members && <div><dt>팀원</dt><dd>{project.members.join(' · ')}</dd></div>}{project.coreFeature && <div><dt>핵심</dt><dd>{project.coreFeature}</dd></div>}</dl>
        {project.status === 'live' && project.url ? (
          <a className="project-link" href={project.url} target="_blank" rel="noreferrer">작품 보러 가기 <ExternalLink size={18} /></a>
        ) : <div className="project-archive"><ImageIcon size={17} /><span>{project.note ?? '기획서 사진으로 남은 프로젝트'}</span></div>}
      </div>
    </article>
  )
}

function PhotoGrid({ photos: items, liked, saved, onOpen, onLike, onSave }: { photos: PhotoRecord[]; liked: Set<string>; saved: Set<string>; onOpen: (photo: PhotoRecord) => void; onLike: (id: string) => void; onSave: (id: string) => void }) {
  return (
    <div className="photo-grid">
      {items.map((photo, index) => (
        <article className="memory-card" key={photo.id} data-reveal={index % 2 ? 'right' : 'left'} style={{ '--reveal-delay': `${(index % 3) * 60}ms` } as React.CSSProperties}>
          <button className="memory-image" onClick={() => onOpen(photo)} aria-label={`${photo.title} 사진 크게 보기`}>
            <img src={photoAsset(photo)} alt={photo.alt} loading={index < 2 ? 'eager' : 'lazy'} />
            <span className="memory-number">#{String(index + 1).padStart(2, '0')}</span>
            <span className="memory-open"><Maximize2 /> 크게 보기</span>
          </button>
          <div className="memory-meta">
            <div><span>{getClassLabel(photo.classId)} · {categoryLabels[photo.category]}</span><h4>{photo.title}</h4><p>{photo.caption}</p></div>
            <div className="memory-actions">
              <button className={liked.has(photo.id) ? 'active like' : 'like'} onClick={() => onLike(photo.id)} aria-label={`${photo.title} 좋아요`}><Heart size={19} fill={liked.has(photo.id) ? 'currentColor' : 'none'} /></button>
              <button className={saved.has(photo.id) ? 'active' : ''} onClick={() => onSave(photo.id)} aria-label={`${photo.title} 내 앨범에 저장`}><Bookmark size={19} fill={saved.has(photo.id) ? 'currentColor' : 'none'} /></button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function AlbumView({ photos: albumPhotos, liked, saved, onOpen, onLike, onSave, onChooseClass }: { photos: PhotoRecord[]; liked: Set<string>; saved: Set<string>; onOpen: (photo: PhotoRecord) => void; onLike: (id: string) => void; onSave: (id: string) => void; onChooseClass: () => void }) {
  return (
    <div className="album-view">
      <header data-reveal="up"><div className="album-icon"><Bookmark size={30} fill="currentColor" /></div><span>MY MEMORY ALBUM</span><h2>저장한 사진</h2><p>북마크한 사진은 현재 브라우저에만 저장됩니다.</p></header>
      {albumPhotos.length ? <PhotoGrid photos={albumPhotos} liked={liked} saved={saved} onOpen={onOpen} onLike={onLike} onSave={onSave} /> : (
        <div className="empty-album" data-reveal="up"><BookOpen size={42} /><h3>저장한 사진이 없습니다</h3><p>사진 카드의 북마크 버튼을 누르면<br />이곳에서 다시 볼 수 있습니다.</p><button className="secondary-button" onClick={onChooseClass}>사진 둘러보기 <ArrowRight size={18} /></button></div>
      )}
    </div>
  )
}

function CreatorSection() {
  return (
    <section className="creator-section" aria-labelledby="creator-title">
      <div className="creator-photo" data-reveal="left">
        <img src={photoAsset({ id: '31-caricature-me' }, 'large')} alt="3학년 1반 재현이가 그린 병찬쌤 초상화" loading="lazy" />
        <span>DRAWN BY 3학년 1반 재현 ✎</span>
        <div className="creator-photo-caption"><strong>병찬쌤 초상화</strong><small>3학년 1반 재현이가 그린 그림</small></div>
      </div>
      <div className="creator-note" data-reveal="right">
        <div className="tape tape-creator" />
        <span className="creator-kicker">ONE LAST MESSAGE</span>
        <h2 id="creator-title">최종 우승팀은<br /><em>DM 주세요!</em></h2>
        <p>최종 우승팀은 인스타그램으로 연락해 주세요.<br />단성고 학생이면 누구나 맞팔 환영 🙌</p>
        <div className="creator-sign"><span>제작자</span><strong>바이브코더 병찬쌤</strong></div>
        <a href="https://www.instagram.com/bong_chanii" target="_blank" rel="noreferrer"><Instagram size={21} /> 병찬쌤에게 DM 보내기 <ArrowRight size={20} /></a>
        <small>@bong_chanii</small>
      </div>
    </section>
  )
}

export default App
