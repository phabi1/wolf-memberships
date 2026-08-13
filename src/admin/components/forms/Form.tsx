import { FormProvider } from 'react-hook-form';

export default function Form( { children, form, onSubmit }: any ) {
	return (
		<FormProvider { ...form }>
			<form onSubmit={ form.handleSubmit( onSubmit ) }>{ children }</form>
		</FormProvider>
	);
}
