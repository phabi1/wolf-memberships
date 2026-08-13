import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Controller, useFormContext } from 'react-hook-form';

export default function SelectField( { name, label, options }: any ) {
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
					<Select { ...field } error={ !! fieldState.error }>
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
