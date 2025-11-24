# 404 오류 해결 가이드 - 포트폴리오 및 공지사항

## 문제
포트폴리오나 공지사항 게시된 글을 클릭하면 404 오류가 발생합니다.

## 원인 분석

### 1. Supabase RLS 정책 확인
**아래 단계를 따라 Supabase 대시보드에서 확인하세요:**

1. Supabase 대시보드 열기
2. `Authentication` → `Policies` 섹션
3. `portfolio` 테이블 확인
   - ✅ "Allow public to read portfolio" 정책이 있는지 확인
   - ✅ 정책이 `SELECT` 권한을 `public` 역할에 부여하는지 확인
4. `notices` 테이블 확인
   - ✅ "Allow public to read notices" 정책이 있는지 확인
   - ✅ 정책이 `SELECT` 권한을 `public` 역할에 부여하는지 확인

### 2. 데이터 확인
**Supabase 대시보드의 SQL Editor에서 실행하세요:**

```sql
-- 포트폴리오 데이터 확인
SELECT COUNT(*) FROM portfolio;

-- 공지사항 데이터 확인
SELECT COUNT(*) FROM notices;

-- 특정 ID로 조회 테스트
SELECT * FROM portfolio LIMIT 1;
SELECT * FROM notices LIMIT 1;
```

### 3. 스키마 업데이트 실행
만약 RLS 정책이 없거나 잘못되었다면, 다음 파일들을 Supabase 대시보드의 SQL Editor에서 순서대로 실행하세요:

**Step 1:** `supabase-schema.sql` 실행
- RLS 정책 재설정 (중복 오류 없음)

**Step 2:** `supabase-storage-setup.sql` 실행
- Storage 정책 재설정 (선택사항)

## 디버깅 체크리스트

- [ ] Supabase 대시보드에서 `portfolio` 테이블 데이터 존재 확인
- [ ] Supabase 대시보드에서 `notices` 테이블 데이터 존재 확인
- [ ] RLS 정책 "Allow public to read portfolio" 존재 확인
- [ ] RLS 정책 "Allow public to read notices" 존재 확인
- [ ] `supabase-schema.sql` 실행하여 정책 업데이트
- [ ] 브라우저 캐시 삭제 후 재시도

## 예상되는 오류 메시지 및 해결

### "ERROR: 42710: policy already exists"
- **원인**: RLS 정책이 이미 존재
- **해결**: `supabase-schema.sql` 사용 (DO ... IF NOT EXISTS 사용)

### "404 Not Found"
- **원인**: 
  1. 해당 ID의 데이터가 없음
  2. RLS 정책이 없어서 데이터를 읽을 수 없음
  3. 잘못된 ID 형식
- **해결**:
  1. Supabase 대시보드에서 데이터 확인
  2. RLS 정책 확인 및 업데이트
  3. ID가 UUID 형식인지 확인

## 다음 단계

1. Supabase 대시보드 열기
2. 위의 "데이터 확인" SQL 쿼리 실행
3. 결과 확인 후 필요한 업데이트 실행
4. 브라우저에서 다시 테스트

## 문의
여전히 문제가 해결되지 않으면:
- 브라우저 개발자 도구의 Network 탭에서 API 응답 확인
- 브라우저 콘솔의 에러 메시지 확인
- Supabase 로그 확인 (대시보드 → Logs → API)

