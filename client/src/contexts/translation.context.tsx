import React, { FC, createContext, useContext } from 'react';

type Translate = (key: string, options?: any) => string;

export type TTranslationContext = {
	t: Translate;
};

const defaultContextValues: TTranslationContext = {
	t: (key: string) => key,
};

export const TranslationContext =
	createContext<TTranslationContext>(defaultContextValues);

export const useTranslate = () => {
	return useContext(TranslationContext);
};

type TranslationProviderProps = {
	translationsProvider?: TTranslationContext;
	children: React.ReactNode;
};

export const TranslationContextProvider: FC<TranslationProviderProps> = ({
	translationsProvider,
	children,
}) => {
	return (
		<TranslationContext.Provider
			value={{ ...(translationsProvider || defaultContextValues) }}
		>
			{children}
		</TranslationContext.Provider>
	);
};