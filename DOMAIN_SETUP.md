# 가비아 도메인을 Netlify에 연결하는 방법

## 1. Netlify에서 커스텀 도메인 추가

### 단계별 가이드

1. **Netlify 대시보드 접속**
   - [Netlify 대시보드](https://app.netlify.com)에 로그인
   - 배포된 사이트 선택 (comeprima.netlify.app)

2. **도메인 설정으로 이동**
   - 사이트 선택 → **Domain settings** 클릭
   - 또는 **Site configuration** → **Domain management**

3. **커스텀 도메인 추가**
   - **Add custom domain** 버튼 클릭
   - 도메인 입력 (예: `comeprima.co.kr` 또는 `www.comeprima.co.kr`)
   - **Verify** 클릭

4. **DNS 설정 정보 확인**
   - Netlify가 DNS 설정 정보를 제공합니다:
     - **A Record**: `75.2.60.5` (또는 다른 IP)
     - **CNAME Record**: `[사이트이름].netlify.app`
     - **TXT Record**: (검증용, 필요시)

## 2. 가비아에서 DNS 설정

### 가비아 DNS 관리 방법

1. **가비아 로그인**
   - [가비아](https://www.gabia.com)에 로그인
   - **나의 서비스** → **도메인 관리** 클릭

2. **DNS 관리 메뉴로 이동**
   - 연결할 도메인 선택
   - **DNS 관리** 또는 **네임서버 관리** 클릭

3. **DNS 레코드 추가/수정**

   #### 방법 A: A 레코드 사용 (루트 도메인용)
   ```
   타입: A
   호스트: @ (또는 비워두기)
   값: 75.2.60.5
   TTL: 3600 (또는 기본값)
   ```

   #### 방법 B: CNAME 레코드 사용 (서브도메인용)
   ```
   타입: CNAME
   호스트: www
   값: [사이트이름].netlify.app
   TTL: 3600 (또는 기본값)
   ```

   #### 루트 도메인과 www 모두 연결하려면:
   ```
   A 레코드:
   호스트: @
   값: 75.2.60.5

   CNAME 레코드:
   호스트: www
   값: [사이트이름].netlify.app
   ```

4. **DNS 설정 저장**
   - 설정 완료 후 **저장** 또는 **적용** 클릭

## 3. Netlify SSL 인증서 설정

1. **Netlify에서 SSL 인증서 발급**
   - 도메인 추가 후 자동으로 Let's Encrypt SSL 인증서 발급
   - **Domain settings** → **HTTPS** 탭에서 확인
   - 발급까지 몇 분 소요될 수 있습니다

2. **강제 HTTPS 설정 (선택사항)**
   - **Domain settings** → **HTTPS** → **Force HTTPS** 활성화

## 4. DNS 전파 확인

### 확인 방법

1. **온라인 도구 사용**
   - [whatsmydns.net](https://www.whatsmydns.net)에서 도메인 확인
   - 전 세계 DNS 서버에서 도메인 전파 상태 확인

2. **터미널에서 확인**
   ```bash
   # A 레코드 확인
   dig yourdomain.com A
   
   # CNAME 레코드 확인
   dig www.yourdomain.com CNAME
   ```

3. **일반적인 전파 시간**
   - 최소: 5-10분
   - 최대: 24-48시간 (보통 1-2시간 이내)

## 5. 문제 해결

### 도메인이 연결되지 않는 경우

1. **DNS 설정 확인**
   - 가비아에서 DNS 레코드가 올바르게 설정되었는지 확인
   - TTL 값이 너무 높으면 변경 사항 반영이 늦을 수 있습니다

2. **Netlify 도메인 검증 확인**
   - Netlify 대시보드에서 도메인 상태 확인
   - 경고나 오류 메시지가 있는지 확인

3. **캐시 클리어**
   - 브라우저 캐시 삭제
   - DNS 캐시 플러시 (로컬)
     ```bash
     # macOS
     sudo dscacheutil -flushcache
     
     # Windows
     ipconfig /flushdns
     ```

4. **가비아 네임서버 확인**
   - 가비아 기본 네임서버를 사용하는지 확인
   - 다른 네임서버를 사용 중이라면 Netlify DNS로 변경 고려

## 6. 추가 설정 (선택사항)

### www 리다이렉트 설정

Netlify에서 자동으로 www와 루트 도메인 간 리다이렉트를 설정할 수 있습니다:
- **Domain settings** → **Domain management**
- 기본 도메인 선택 (www 또는 루트)
- **Set up Netlify DNS** 또는 리다이렉트 설정

### netlify.toml에 리다이렉트 추가

```toml
[[redirects]]
  from = "http://comeprima.co.kr/*"
  to = "https://www.comeprima.co.kr/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://comeprima.co.kr/*"
  to = "https://www.comeprima.co.kr/:splat"
  status = 301
```

## 참고사항

- **가비아 DNS 관리**: 가비아는 DNS 관리를 자체적으로 제공하거나 외부 DNS 서비스를 사용할 수 있습니다
- **네임서버 변경**: Netlify DNS를 사용하려면 가비아에서 네임서버를 Netlify로 변경해야 합니다
- **도메인 검증**: Netlify는 도메인 소유권을 검증하기 위해 DNS 레코드를 확인합니다

## Netlify DNS 사용 (대안)

가비아 DNS 대신 Netlify DNS를 사용하는 방법:

1. **Netlify에서 네임서버 정보 확인**
   - **Domain settings** → **DNS** 탭
   - Netlify 네임서버 주소 확인 (예: `dns1.p01.nsone.net`)

2. **가비아에서 네임서버 변경**
   - 가비아 → 도메인 관리 → 네임서버 설정
   - Netlify 네임서버로 변경

3. **Netlify에서 DNS 레코드 관리**
   - 모든 DNS 레코드를 Netlify에서 관리

