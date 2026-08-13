import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import slugify from 'slugify';

export interface MachineNameFieldProps {
	name: string;
	label: string;
	fieldName: string;
}

export default function MachineNameField( {
	name,
	label,
	fieldName,
}: MachineNameFieldProps ) {
	const [ locked, setLocked ] = useState( true );
	const { watch, setValue, control } = useFormContext();

	useEffect( () => {
		const subscription = watch( ( value, { name: changedField } ) => {
			if ( changedField === fieldName && locked ) {
				const machineName = slugify( value[ fieldName ], {
					lower: true,
					strict: true,
				} );
				setValue( name, machineName );
			}
		} );
		return () => subscription.unsubscribe();
	}, [ watch, setValue, fieldName, name, locked ] );

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
						type="text"
						error={ !! fieldState.error }
						value={ field.value || '' }
						onChange={ ( e ) => {
							field.onChange( e.target.value );
						} }
						disabled={ locked }
						helperText={
							fieldState.error ? fieldState.error.message : ''
						}
						slotProps={ {
							input: {
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={ () =>
												setLocked( ! locked )
											}
										>
											{ locked ? (
												<LockOutlinedIcon />
											) : (
												<LockOpenIcon />
											) }
										</IconButton>
									</InputAdornment>
								),
							},
						} }
					/>
				</FormControl>
			) }
		/>
	);
}
