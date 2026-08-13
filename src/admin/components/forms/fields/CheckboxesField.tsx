import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function CheckboxesField( { name, label, options }: any ) {
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
					<FormLabel>{ label }</FormLabel>
					<FormGroup>
						{ options.map( ( option: any ) => (
							<FormControlLabel
								key={ option.value }
								control={
									<Checkbox
										checked={
											field.value?.includes(
												option.value
											) || false
										}
										onChange={ ( e ) => {
											const newValue = e.target.checked
												? [
														...( field.value ||
															[] ),
														option.value,
												  ]
												: field.value?.filter(
														( v: any ) =>
															v !== option.value
												  );
											field.onChange( newValue );
										} }
									/>
								}
								label={ option.label }
							/>
						) ) }
					</FormGroup>
				</FormControl>
			) }
		/>
	);
}
