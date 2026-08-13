import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { Controller, useFormContext } from 'react-hook-form';

export default function Input( { name, label, type }: any ) {
	const { control } = useFormContext();
	return (
		<Controller
			name={ name }
			control={ control }
			render={ ( { field, fieldState } ) => (
				<FormControl
					fullWidth
					error={ !! fieldState.error }
					sx={ { mb: 2 } }
				>
					<TextField
						{ ...field }
						label={ label }
						type={ type }
						error={ !! fieldState.error }
						value={ field.value || '' }
						onChange={ ( e ) => {
							field.onChange( e.target.value );
						} }
						helperText={
							fieldState.error ? fieldState.error.message : ''
						}
					/>
				</FormControl>
			) }
		/>
	);
}
