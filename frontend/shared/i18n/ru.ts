export const ru = {
  // LoginView
  loginTitle: "Вход в систему",
  registerTitle: "Регистрация Администратора",
  registerHint: "В базе данных нет пользователей. Создайте главного администратора системы.",
  emailLabel: "Email адрес",
  passwordLabel: "Пароль",
  loading: "Загрузка...",
  loginBtn: "Войти",
  registerBtn: "Создать администратора",

  // AdminDashboardClient
  cmsTitle: "Управление Сайтом (CMS)",
  tabContent: "Контент",
  tabMedia: "Медиатека",
  tabUsers: "Пользователи",
  logout: "Выйти",
  switchToSite: "Перейти на сайт",

  // ContentManager
  contentTitle: "Управление контентом",
  noData: "Нет данных",
  addBtn: "+ Добавить",
  deleteConfirm: "Удалить этот элемент?",
  cannotDeleteLast: "Нельзя удалять в ноль! Должно остаться хотя бы одно значение.",
  noPhoto: "Нет фото",
  uploadFile: "Загрузить",
  orInsertUrl: "Или вставьте URL",
  saveBtn: "💾 Сохранить",
  saveSuccess: "Успешно сохранено!",
  saveError: "Ошибка при сохранении:",
  uploadError: "Ошибка загрузки",

  // MediaLibrary
  mediaTitle: "Медиатека",
  mediaHint: "Здесь хранятся все загруженные картинки. Вы можете скопировать ссылку для вставки или удалить ненужные.",
  uploadNewFile: "Загрузить новый файл",
  noMediaFiles: "Файлов пока нет",
  uploading: "Загрузка...",
  linkCopied: "Ссылка скопирована!",
  copyLink: "Копировать URL",
  deleteFileConfirm: "Точно удалить этот файл навсегда?",

  // UserList
  usersTitle: "Список пользователей системы",
  noUsers: "Нет пользователей",
  emailHeader: "Email",
  roleHeader: "Роль",
  actionsHeader: "Действия",
  changeCredentials: "Изменить данные",
  deleteUser: "Удалить",
  deleteUserConfirm: "Вы уверены, что хотите удалить пользователя",
  newEmailPrompt: "Введите новый логин (email) для пользователя (оставьте пустым, чтобы не менять):",
  newPasswordPrompt: "Введите новый пароль для пользователя (оставьте пустым, чтобы не менять):",
  editConfirm1: "Вы уверены, что хотите изменить данные этого пользователя?",
  editConfirm2: "Вы ТОЧНО уверены? Это действие нельзя отменить.",
  passwordTooShort: "Пароль слишком короткий!",
  credentialsChanged: "Данные успешно изменены!",
  reloginRequired: "Вы изменили свой логин. Пожалуйста, войдите в систему заново.",

  // MediaUploader
  mediaUploaderTitle: "Медиа-хранилище",
  mediaUploaderHint: "Загрузите изображение (JPG/PNG). Бэкенд сожмет его в WebP.",
  mediaUploaderConvertSuccess: "✅ Конвертировано в WebP!",
  mediaUploaderBtnUploading: "Загрузка и конвертация...",
  mediaUploaderBtn: "Загрузить файл",
  mediaUploaderUrlHint: "URL файла (скопируйте в JSON):",

  // CreateClientForm
  createClientTitle: "Добавить клиента",
  createClientHint: "Создать учетную запись для владельца сайта. Роль: КЛИЕНТ.",
  createClientBtn: "Создать клиента",
  createClientBtnCreating: "Создание...",
  createClientSuccess: "Клиент успешно создан!",
};

export type Translations = typeof ru;
