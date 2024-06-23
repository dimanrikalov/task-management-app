export default {
	taskify: 'Taskify',
	addColleagues: 'Добави колега',
	editColleagues: 'Редактирай колеги',
	components: {
		buttons: {
			signIn: 'Впиши се',
			signUp: 'Регистрирай се'
		},
		inputs: {
			email: 'Имейл',
			username: 'Потребителско име',
			password: 'Парола',
			enterBoardName: 'Въведи име на дъска',
			enterWorkspaceName: 'Въведи име на работното пространство',
			enterColleagueName: 'Въведи име на колега'
		}
	},
	introView: {
		or: 'или',
		subtitle:
			'Taskify ти позволява да работиш по-бързо и да свършиш повече работа.',
		description:
			'Работните пространства, дъски, съобщения и задачи на Taskify, ти позволяват да организираш и приоритизираш задачите си по ясен, структуриран и възнаграждаващ начин.'
	},
	signInView: {
		dontHaveAcc: 'Нямаш регистрация?'
	},
	signUpView: {
		alreadyHaveAcc: 'Вече имаш регистрация?'
	},
	dashboard: {
		title: 'Табло',
		boards: 'Дъски',
		notifications: 'Известия',
		workspaces: 'Раб. простр.',
		filter: {
			boards: 'Филтрирай дъски',
			workspaces: 'Филтрирай раб. простр.'
		},
		stats: {
			boardsCount: 'Дъски',
			columnsCount: 'Колони',
			messagesCount: 'Съобщения',
			pendingTasks: 'Висящи задачи',
			stepsCompleted: 'Отметнати стъпки',
			tasksCompleted: 'Извършени задачи',
			timeSpent: 'Отделено време за задачи',
			workspacesCount: 'Работни пространства'
		}
	},
	createWorkspace: {
		title: 'Нека създадем работно пространство!',
		create: 'Създай',
		message:
			'Повиши своята продуктивност като позволиш на всички да достъпват множество дъски в рамките на едно споделено пространство.',
		nameWorkspace: 'Именувай своето работно пространство',
		usersWithAccess: 'Потребители с достъп'
	},
	createBoard: {
		title: 'Нека създадем дъска!',
		create: 'Създай',
		message:
			'Дъската е тайната към подобрена продуктивност и организация. Тя предлага визуална яснота и ти помага да бъдеш винаги в крак с приоритетите и ефективно да разпределяш натоварването в екипа.',
		chooseWorkspace: 'Избери работно пространство',
		enterWorkspaceName: 'Въведи име на раб. простр.',
		nameYourBoard: 'Именувай своята дъска',
		enterBoardName: 'Въведи име на дъска',
		boardUsersList: 'Потребители с достъп'
	},
	chat: {
		title: 'Чат на дъската',
		enterMsg: 'Въведи съобщение'
	},
	confirmationModal: {
		areYouSure: 'Сигурен ли си че искаш да изтриеш',
		confirm: 'Потвърди',
		cancel: 'Отмени'
	},
	workspace: {
		boards: 'Дъски',
		enterBoardName: 'Въведи име на раб. пространство',
		searchByBoardName: 'Търси по име на раб. пространство'
	},
	board: {
		enterName: 'Въведи име',
		boardColleagues: 'Колеги с достъп'
	},
	column: {
		done: 'Завърешни',
		toDo: 'Да започна',
		doing: 'Започнати',
		confirm: 'Потвърди',
		addTask: 'Добави задача',
		enterColumnName: 'Въведи име на колона'
	},
	taskModal: {
		letsCreate: 'Нека създадем задача!',
		letsEdit: 'Нека редактираме задача!',
		descriptionCreate:
			'Задачата е градивния елемент на една дъска. С него един потребител взаимодейства най-често.',
		descriptionEdit: `Напълно е нормално една задача да промени свойствата си по време на жизнения цикъл на една дъска. За щастие, посредством Taskify, не трябва да се притесняваш за редактирането на който и да е детайл.`,
		enterName: 'Именувай задачата',
		editName: 'Редактирай името на задачата',
		inputName: 'Въведи име на задачата',
		addDescription: 'Добави описание',
		editDescription: 'Редактирай описание',
		enterDescription: 'Въведи описание',
		priority: 'Приоритет',
		low: 'Нисък',
		medium: 'Среден',
		high: 'Висок',
		effort: 'Усилие',
		timeEstimation: 'Времева Оценка',
		timeSpent: 'Прекарано Време',
		hours: 'ч',
		minutes: 'м',
		chooseAssignee: 'Назначи потребител',
		editAssignee: 'Редактирай назначен потребител',
		addSteps: 'Добави стъпки',
		stepInput: 'Въведи стъпка',
		editSteps: 'Редактирай стъпки',
		overallCompletion: 'Прогрес',
		addTask: 'Добави задача',
		editTask: 'Редактирай задачата',
		deleteTask: 'Изтрий задачата',
		confirmDeletion: 'Потвърди изтриването'
	},
	editProfile: {
		image: 'Редактирай потребителско изображение',
		password: 'Редактирай парола',
		newPassword: 'Нова парола',
		username: 'Редактирай потр. име',
		newUsername: 'Ново потребителско име',
		email: 'Редактирай имейл',
		newEmail: 'Нов имейл',
		currentEmail: 'Текущ имейл',
		deleteProfile: 'Изтрий потр. профил'
	}
};
