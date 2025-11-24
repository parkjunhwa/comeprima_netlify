# Netlify 배포 및 Supabase 설정 가이드

## Netlify에서 Supabase 환경 변수 설정 방법

### 1. Netlify 대시보드 접속
1. [Netlify 대시보드](https://app.netlify.com)에 로그인
2. 배포된 사이트 선택 (comeprima.netlify.app)

### 2. 환경 변수 설정
1. 사이트 설정으로 이동:
   - 사이트 선택 → **Site settings** 클릭
   - 또는 URL: `https://app.netlify.com/sites/[사이트이름]/configuration/env`

2. 환경 변수 추가:
   - 왼쪽 메뉴에서 **Environment variables** 클릭
   - **Add a variable** 버튼 클릭

3. 다음 환경 변수들을 추가:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Supabase 프로젝트 정보 확인 방법
1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. **Settings** → **API** 메뉴로 이동
4. 다음 정보 확인:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`에 사용
   - **anon public** 키: `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 사용

### 4. 환경 변수 적용
- 환경 변수를 추가/수정한 후:
  1. **Deploys** 탭으로 이동
  2. **Trigger deploy** → **Clear cache and deploy site** 클릭
  3. 또는 자동으로 재배포가 트리거될 수 있습니다

### 5. 환경 변수 확인
배포 후 브라우저 콘솔에서 환경 변수가 제대로 로드되었는지 확인:
```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

## 주의사항
- `NEXT_PUBLIC_` 접두사가 붙은 환경 변수는 클라이언트 사이드에서도 접근 가능합니다
- 환경 변수를 변경한 후에는 반드시 재배포가 필요합니다
- 프로덕션과 스테이징 환경에 서로 다른 Supabase 프로젝트를 사용할 수 있습니다

---

## 도메인 변경 시 Supabase 리다이렉트 URL 설정

도메인과 호스팅이 연결된 후, **Supabase에서 리다이렉트 URL을 업데이트해야 합니다**.

### 왜 필요한가요?
Supabase Auth는 보안을 위해 허용된 리다이렉트 URL만 사용할 수 있습니다. 새로운 도메인을 사용하려면 Supabase 대시보드에서 해당 도메인을 허용 목록에 추가해야 합니다.

### 설정 방법

1. **Supabase 대시보드 접속**
   - [Supabase 대시보드](https://app.supabase.com)에 로그인
   - 프로젝트 선택

2. **Authentication 설정으로 이동**
   - 왼쪽 메뉴에서 **Authentication** 클릭
   - **URL Configuration** 섹션으로 스크롤

3. **Site URL 업데이트**
   - **Site URL** 필드에 새 도메인 입력:
     ```
     https://comeprima.co.kr
     ```
     또는
     ```
     https://www.comeprima.co.kr
     ```

4. **Redirect URLs 추가**
   - **Redirect URLs** 섹션에서 **Add URL** 클릭
   - 다음 URL들을 추가:
     ```
     https://comeprima.co.kr/auth/callback
     https://www.comeprima.co.kr/auth/callback
     https://comeprima.netlify.app/auth/callback
     ```
   
   **참고**: 
   - 여러 도메인을 사용하는 경우 모두 추가
   - 개발 환경용 Netlify URL도 함께 추가하는 것을 권장

5. **저장**
   - **Save** 버튼 클릭
   - 변경사항이 즉시 적용됩니다

### 확인해야 할 URL 패턴

프로젝트에서 사용하는 인증 콜백 경로:
- `/auth/callback` - 일반 인증 콜백
- `/auth/update-password` - 비밀번호 변경 (리다이렉트 대상)

### 추가 설정 (선택사항)

**Email Templates**에서 이메일 링크도 새 도메인으로 업데이트할 수 있습니다:
- **Authentication** → **Email Templates**
- 각 템플릿에서 `{{ .SiteURL }}` 변수가 새 도메인을 사용하도록 확인

### 문제 해결

**인증 후 리다이렉트가 작동하지 않는 경우:**
1. Supabase 대시보드에서 Redirect URLs에 정확한 URL이 추가되었는지 확인
2. URL에 `https://` 프로토콜이 포함되어 있는지 확인
3. URL 끝에 슬래시(`/`)가 없는지 확인
4. 브라우저 콘솔에서 에러 메시지 확인

**에러 메시지 예시:**
- `redirect_to url must have an allowed url` → Redirect URLs에 해당 URL 추가 필요

