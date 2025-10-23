# Gemini Sports Club - 백엔드 및 데이터베이스 설계 문서

이 문서는 현재 **외부 API 연동을 시뮬레이션하는 프론트엔드 프로토타입**을 확장하여, 프로덕션 환경에 배포 가능한 실제 백엔드 시스템과 데이터베이스를 구축하기 위한 설계안을 제시합니다.

## 1. 백엔드 아키텍처 (Backend Architecture)

### 1.1. 기술 스택 (Tech Stack)

-   **런타임 / 프레임워크:** **Node.js** with **Express.js** 또는 **NestJS** (TypeScript)
-   **인증 (Authentication):** **JWT (JSON Web Tokens)**
-   **ORM (Object-Relational Mapping):** **Prisma** 또는 **TypeORM**

### 1.2. API 설계 (RESTful API Design)

API는 RESTful 원칙에 따라 리소스 중심으로 설계합니다.

#### 인증 (Auth)
-   `POST /api/auth/signup`: 회원가입 (성공 시 JWT 발급)
-   `POST /api/auth/login`: 로그인 (성공 시 JWT 발급)

#### 사용자 (Users)
-   `GET /api/users/me`: 현재 로그인된 사용자 정보 조회 (JWT 필요)
-   `GET /api/users/me/bets`: 현재 로그인된 사용자의 베팅 내역 조회 (JWT 필요)
-   `GET /api/users`: 모든 사용자 목록 조회 (관리자 전용)
-   `POST /api/users`: 신규 사용자 생성 (관리자 전용)
-   `PUT /api/users/:id`: 특정 사용자 정보 수정 (관리자 전용, 예: 골드 지급, 프리미엄 전환)
-   `DELETE /api/users/:id`: 특정 사용자 삭제 (관리자 전용)


#### 스포츠 데이터 (Sports & Matches)
-   `GET /api/sports`: 지원하는 스포츠 카테고리 목록 조회
-   `GET /api/matches?sportId=kbo`: 특정 스포츠의 경기 목록 조회
-   `GET /api/matches/:id`: 특정 경기 상세 정보 조회

#### 베팅 (Bets)
-   `GET /api/bets`: 모든 베팅 목록 조회 (관리자 전용)
-   `POST /api/bets`: 새로운 베팅 생성 (JWT 필요, Request Body에 `matchId`, `prediction`, `amount` 포함)
-   `PUT /api/bets/:id`: 특정 베팅 정보 수정 (관리자 전용, 예: 상태 변경)
-   `DELETE /api/bets/:id`: 특정 베팅 삭제 (관리자 전용)


#### Gemini AI 연동
-   `POST /api/matches/:id/analysis`: 특정 경기의 AI 분석 생성 요청 (JWT 필요)
    -   **보안 및 아키텍처:** **현재 프로토타입에서는 학습 및 개발 편의를 위해 클라이언트에서 직접 Gemini API를 호출하지만, 이는 API 키를 노출시키는 심각한 보안 위험이 있습니다.**
    -   **프로덕션 설계:** **실제 서비스에서는 반드시 이 엔드포인트를 통해 백엔드 서버가 Gemini API를 호출해야 합니다.** 클라이언트는 Gemini API 키에 절대 직접 접근해서는 안 됩니다. 백엔드는 분석 결과를 데이터베이스의 `matches` 테이블에 캐싱(저장)하여 불필요한 API 호출과 비용을 줄이는 역할도 수행합니다.

### 1.3. 실시간 데이터 소싱 (Real-time Data Sourcing)

-   **역할:** 백엔드는 외부 스포츠 데이터 API(예: The Odds API, Sportradar 등)로부터 실제 경기 일정, 결과, 배당률 등의 데이터를 주기적으로 가져오는 핵심적인 역할을 담당합니다. **현재 프론트엔드의 `realtimeDataService.ts`는 바로 이 백엔드 로직을 시뮬레이션하는 모의 구현입니다.**
-   **프로세스:**
    1.  **스케줄링:** `node-cron`과 같은 스케줄러를 사용하여 특정 시간 간격(예: 1시간마다)으로 데이터 업데이트 작업을 실행합니다.
    2.  **API 호출:** 외부 스포츠 API에 요청을 보내 최신 데이터를 가져옵니다. **API 키는 서버 환경변수(.env)에 안전하게 저장**하여 클라이언트에 노출되지 않도록 합니다.
    3.  **데이터베이스 업데이트:** 가져온 데이터를 `matches` 테이블에 업데이트하거나 새로 추가합니다. (UPSERT 로직)
    4.  **클라이언트 제공:** 클라이언트가 `/api/matches` 엔드포인트를 요청하면, 백엔드는 자체 데이터베이스에 저장된 최신 정보를 제공합니다.
-   **장점:** 이 구조는 외부 API 호출 횟수를 최소화하여 비용을 절감하고, API 키를 안전하게 보호하며, 우리 서비스에 맞는 데이터 형태로 가공하여 안정적으로 제공할 수 있게 합니다.

## 2. 데이터베이스 설계 (Database Design)

관계형 데이터베이스인 **PostgreSQL**을 기준으로 스키마를 설계합니다.

### 2.1. 테이블 스키마 (Table Schema)

#### `users`
사용자 정보를 저장하는 테이블입니다.

| Column          | Type                    | Constraints                               | Description                  |
| --------------- | ----------------------- | ----------------------------------------- | ---------------------------- |
| `id`            | `UUID`                  | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`| 사용자 고유 ID (PK)            |
| `email`         | `VARCHAR(255)`          | `UNIQUE`, `NOT NULL`                      | 이메일 (로그인 ID)           |
| `password_hash` | `VARCHAR(255)`          | `NOT NULL`                                | 해시된 비밀번호 (Bcrypt 사용) |
| `name`          | `VARCHAR(100)`          | `NOT NULL`                                | 사용자 이름(별명)            |
| `gold`          | `INTEGER`               | `NOT NULL`, `DEFAULT 100`                 | 보유 골드                    |
| `is_admin`      | `BOOLEAN`               | `NOT NULL`, `DEFAULT FALSE`               | 관리자 여부                  |
| `is_premium`    | `BOOLEAN`               | `NOT NULL`, `DEFAULT FALSE`               | 프리미엄 회원 여부           |
| `created_at`    | `TIMESTAMP WITH TIME ZONE`| `NOT NULL`, `DEFAULT now()`               | 생성일시                     |
| `updated_at`    | `TIMESTAMP WITH TIME ZONE`| `NOT NULL`, `DEFAULT now()`               | 수정일시                     |

#### `sports`
스포츠 카테고리 정보를 저장하는 테이블입니다.

| Column | Type           | Constraints        | Description        |
| ------ | -------------- | ------------------ | ------------------ |
| `id`   | `VARCHAR(50)`  | `PRIMARY KEY`      | 스포츠 ID (PK, 예: `kbo`) |
| `name` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | 스포츠 이름 (예: `한국 야구`) |

#### `matches`
경기 정보를 저장하는 테이블입니다. (앱의 `Match` 타입과 일관성 유지)

| Column                | Type                    | Constraints                               | Description                |
| --------------------- | ----------------------- | ----------------------------------------- | -------------------------- |
| `id`                  | `VARCHAR(255)`          | `PRIMARY KEY`                             | 외부 API의 경기 고유 ID (PK) |
| `sport_id`            | `VARCHAR(50)`           | `NOT NULL`, `FOREIGN KEY (sports.id)`     | 스포츠 ID (FK)             |
| `match_date`          | `TIMESTAMP WITH TIME ZONE`| `NOT NULL`                                | 경기 날짜 및 시간        |
| `home_team`           | `VARCHAR(100)`          | `NOT NULL`                                | 홈팀 이름                  |
| `away_team`           | `VARCHAR(100)`          | `NOT NULL`                                | 원정팀 이름                |
| `schedule_info`       | `VARCHAR(255)`          | `NULLABLE`                                | 경기 시간 등 스케줄 정보   |
| `home_team_logo_url`  | `VARCHAR(255)`          | `NULLABLE`                                | 홈팀 로고 URL              |
| `away_team_logo_url`  | `VARCHAR(255)`          | `NULLABLE`                                | 원정팀 로고 URL            |
| `odds_home`           | `DECIMAL(5, 2)`         | `NULLABLE`                                | 홈팀 배당률                |
| `odds_away`           | `DECIMAL(5, 2)`         | `NULLABLE`                                | 원정팀 배당률              |
| `odds_draw`           | `DECIMAL(5, 2)`         | `NULLABLE`                                | 무승부 배당률 (축구 등)  |
| `premium_analysis`    | `TEXT`                  | `NULLABLE`                                | **AI 생성 프리미엄 분석 (캐시)** |
| `summary_analysis`    | `TEXT`                  | `NULLABLE`                                | **AI 생성 요약 분석 (캐시)** |
| `home_score`          | `INTEGER`               | `NULLABLE`                                | 홈팀 점수                  |
| `away_score`          | `INTEGER`               | `NULLABLE`                                | 원정팀 점수                |
| `status`              | `VARCHAR(50)`           | `NOT NULL DEFAULT 'scheduled'`            | 경기 상태 (예: scheduled, in-play, finished) |
| `created_at`          | `TIMESTAMP WITH TIME ZONE`| `NOT NULL`, `DEFAULT now()`               | 생성일시                   |
| `updated_at`          | `TIMESTAMP WITH TIME ZONE`| `NOT NULL`, `DEFAULT now()`               | 수정일시                   |

#### `bets`
사용자의 베팅 정보를 저장하는 테이블입니다.

| Column        | Type                    | Constraints                               | Description                         |
| ------------- | ----------------------- | ----------------------------------------- | ----------------------------------- |
| `id`          | `UUID`                  | `PRIMARY KEY`, `DEFAULT gen_random_uuid()`| 베팅 고유 ID (PK)                   |
| `user_id`     | `UUID`                  | `NOT NULL`, `FOREIGN KEY (users.id)`      | 베팅한 사용자 ID (FK)               |
| `match_id`    | `VARCHAR(255)`          | `NOT NULL`, `FOREIGN KEY (matches.id)`    | 베팅한 경기 ID (FK)                 |
| `prediction`  | `VARCHAR(100)`          | `NOT NULL`                                | 사용자의 예측 (예: 'LG 트윈스', 'Draw') |
| `amount`      | `INTEGER`               | `NOT NULL`                                | 베팅 금액 (골드)                    |
| `odds`        | `DECIMAL(5, 2)`         | `NOT NULL`                                | 베팅 시점의 배당률                  |
| `payout`      | `INTEGER`               | `NOT NULL`                                | 예상 당첨금                         |
| `status`      | `VARCHAR(20)`           | `NOT NULL`, `DEFAULT 'pending'`           | 베팅 상태 ('pending', 'won', 'lost') |
| `created_at`  | `TIMESTAMP WITH TIME ZONE`| `NOT NULL`, `DEFAULT now()`               | 생성일시 (베팅 시간)                |


### 2.2. 관계 (Relationships)

-   `bets` 테이블은 `users`와 `matches` 테이블을 연결하는 **중간 테이블** 역할을 합니다.
    -   `bets` to `users` -> **N:1** (한 명의 사용자는 여러 베팅을 할 수 있음)
    -   `bets` to `matches` -> **N:1** (하나의 경기에는 여러 베팅이 있을 수 있음)
-   `matches`는 `sports`와 **N:1** 관계를 가집니다. (하나의 스포츠는 여러 경기를 가짐)