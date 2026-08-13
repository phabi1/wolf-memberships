import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function MultipleSelectField( { name, label, options }: any ) {
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
					<InputLabel>{ label }</InputLabel>
					<Select { ...field } multiple error={ !! fieldState.error }>
						{ options.map( ( option: any ) => (
							<MenuItem
								key={ option.value }
								value={ option.value }
							>
								{ option.label }
							</MenuItem>
						) ) }
					</Select>
				</FormControl>
			) }
		/>
	);
}
