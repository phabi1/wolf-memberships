import FormControl from '@mui/material/FormControl';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Controller, useFormContext } from 'react-hook-form';
import Collapse from '@mui/material/Collapse';
import { PropsWithChildren, useEffect } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';

export type SwitchPanelFieldProps = PropsWithChildren< {
	name: string;
	label: string;
	onOpen?: () => void;
	onClose?: () => void;
} >;

export default function SwitchPanelField( {
	name,
	label,
	children,
	onOpen,
	onClose,
}: SwitchPanelFieldProps ) {
	const { control, watch } = useFormContext();

	const value = watch( name );

	useEffect( () => {
		if ( value && onOpen ) {
			onOpen();
		} else if ( ! value && onClose ) {
			onClose();
		}
	}, [ value, onOpen, onClose ] );

	return (
		<Controller
			name={ name }
			control={ control }
			defaultValue={ false }
			render={ ( { field } ) => (
				<>
					<FormControlLabel
						control={
							<Switch
								checked={ field.value }
								onChange={ ( e ) =>
									field.onChange( e.target.checked )
								}
								slotProps={ {
									input: { 'aria-label': 'controlled' },
								} }
							/>
						}
						label={ label }
						sx={ { mb: 2 } }
					/>
					<Collapse in={ field.value }>{ children }</Collapse>
				</>
			) }
		/>
	);
}
