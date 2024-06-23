import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

export type TUseTranslateResult = {
	t: TFunction<'translation', undefined>;
	changeLanguage(): void;
	language: string;
};

export const languages = {
	bg: 'bg',
	en: 'en'
} as const;

export type Languages = keyof typeof languages;

export function useTranslate(): TUseTranslateResult {
	const { t, i18n } = useTranslation();

	const changeLanguage = () => {
		const newLanguage = i18n.language === 'bg' ? 'en' : 'bg';
		i18n.changeLanguage(newLanguage);
		localStorage.setItem('lng', newLanguage);
	};

	return {
		t,
		changeLanguage,
		language: i18n.language
	};
}
