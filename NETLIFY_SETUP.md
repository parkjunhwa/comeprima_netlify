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

