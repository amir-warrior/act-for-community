# Act for Community — website

Сайт студенческой благотворительной инициативы **Act for Community** (Бишкек).
Next.js 16 · TypeScript · Tailwind CSS 4 · Framer Motion · Decap CMS.

## Запуск

```bash
npm install
npm run dev          # http://localhost:3000
```

Редактирование контента локально (без интернета и логина):

```bash
npm run cms          # во втором терминале
# затем откройте http://localhost:3000/admin
```

## Страницы

| URL | Страница |
| --- | --- |
| `/` | Главная: hero, миссия, цифры, направления, превью событий, CTA |
| `/about` | Goals & Beliefs: миссия, 6 ценностей, цели, таймлайн по годам |
| `/events` | Все события с фильтром (All / Annual / One-time) |
| `/events/[slug]` | Страница события: описание, факты, impact, галерея |
| `/team` | Команда (пока заглушки — данные добавляются в CMS) |
| `/help` | Ask for Help: согласие + ссылка на приватную Google Form |
| `/volunteer` | Набор волонтёров + кнопка на Google Form |
| `/what-you-gain` | Что даёт волонтёрство (без обещаний поступления) |
| `/contact` | Контакты |
| `/admin` | Панель управления контентом (Decap CMS) |

## Где лежит контент

Весь контент — JSON-файлы в папке `content/`, их редактирует CMS:

- `content/events/*.json` — события (один файл = одно событие)
- `content/team/*.json` — участники команды
- `content/settings/site.json` — контакты, **ссылки на Google Forms**, цифры на главной
- `public/uploads/` — фотографии, загруженные через CMS

### Что нужно заполнить перед запуском

- [ ] Ссылки на две Google Forms (от Алана) → CMS → *Site settings* → *Google Forms*.
      Пока ссылка пустая, кнопка честно показывает «Link pending» и сообщение «форма скоро появится».
- [ ] Телефон, email, Telegram → *Site settings* → *Contacts* (пустые поля показываются как «Coming soon»)
- [ ] Цифры на главной → *Site settings* → *Impact numbers* (пустые = «To be verified»)
- [ ] Обложки и галереи событий — реальные фото из @actcom.bis
- [ ] Команда: имя, должность, фото, био
- [ ] Официальный логотип → заменить `src/components/ui/Logo.tsx` и `public/favicon.svg`
- [ ] Проверить дату Spelling Bee (сейчас помечена «Date pending verification»)
- [ ] Согласовать с core team тексты о приватности на странице `/help`

## Приватность заявок

Сайт **не принимает и не хранит** заявки. Обе кнопки открывают Google Forms организации —
ответы видят только владельцы формы. Рекомендации:

1. Создавать формы с аккаунта организации, доступ на редактирование — только core team.
2. В настройках формы не делать ответы публичными («See summary charts» — выключено).
3. Не подключать Google Sheets с открытым доступом по ссылке.

## Деплой (рекомендуется Netlify)

1. Подключить репозиторий `amir-warrior/act-for-community` в Netlify (base directory — пусто, build command — `npm run build`).
2. Задать переменную `NEXT_PUBLIC_SITE_URL` (например `https://act-for-community.netlify.app`).

### Вход в CMS (`/admin`)

Редакторы входят своим аккаунтом GitHub.

1. GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**:
   - Homepage URL: адрес сайта
   - Authorization callback URL: `https://api.netlify.com/auth/done`
2. Скопировать Client ID и создать Client secret.
3. Netlify → Project configuration → Access & security → **OAuth** → Install provider → GitHub → вставить ID и secret.
4. Каждого редактора добавить в репозиторий: GitHub → репозиторий → Settings → Collaborators.

Каждое сохранение в CMS — это коммит в репозиторий; Netlify автоматически пересобирает сайт (~1–2 мин).

## Анимации

- Заголовки появляются по словам (`WordsReveal`)
- Параллакс коллажа фото в hero + вращающийся бейдж
- Бегущая строка ценностей (`Marquee`)
- Текст «Who we are» подсвечивается по мере скролла (`ScrollHighlightText`)
- Счётчики цифр (`StatsGrid`) — только для заполненных значений
- Фильтр событий с «плавающей» плашкой и перестроением сетки
- Таймлайн, линия которого заполняется при скролле
- Карточки ценностей со «светом», следующим за курсором
- Шапка прячется при скролле вниз; мобильное меню раскрывается кругом
- Нижняя панель «Ask for help / Volunteer» на телефоне
- Всё отключается при системной настройке «Reduce motion»
