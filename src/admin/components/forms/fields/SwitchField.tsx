import { useFormContext, Controller } from 'react-hook-form';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

export interface SwitchFieldProps {
	name: string;
	label: string;
}

export default function SwitchField( { name, label }: SwitchFieldProps ) {
	const { control } = useFormContext();
	return (
		<Controller
			name={ name }
			control={ control }
			defaultValue={ false }
			render={ ( { field } ) => (
				<FormControl fullWidth sx={ { mb: 2 } }>
					<FormControlLabel
						control={
							<Switch { ...field } checked={ field.value } />
						}
						label={ label }
					/>
				</FormControl>
			) }
		/>
	);
}
