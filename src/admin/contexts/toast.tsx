import React, { createContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';

export const ToastContext = createContext< {
	position: {
		vertical: 'top' | 'bottom';
		horizontal: 'left' | 'center' | 'right';
	};
	duration: number;
	showToast: (
		message: string,
		severity: 'success' | 'error' | 'info' | 'warning',
		duration?: number
	) => void;
	hideToast: ( id: string ) => void;
} >( {
	position: { vertical: 'bottom', horizontal: 'right' },
	duration: 3000,
	showToast: () => {},
	hideToast: () => {},
} );

export const ToastProvider: React.FC< React.PropsWithChildren< {} > > = ( {
	children,
} ) => {
	const defaultOptions: {
		position: {
			vertical: 'top' | 'bottom';
			horizontal: 'left' | 'center' | 'right';
		};
		duration: number;
	} = {
		position: { vertical: 'bottom', horizontal: 'right' },
		duration: 3000,
	};

	const [ toasts, setToasts ] = useState<
		{
			id: string;
			message: string;
			severity: 'success' | 'error' | 'info' | 'warning';
			position?: {
				vertical: 'top' | 'bottom';
				horizontal: 'left' | 'center' | 'right';
			};
			duration: number;
		}[]
	>( [] );

	const showToast = (
		message: string,
		severity: 'success' | 'error' | 'info' | 'warning',
		duration?: number,
		position?: {
			vertical: 'top' | 'bottom';
			horizontal: 'left' | 'center' | 'right';
		}
	) => {
		const id = Math.random().toString( 36 ).substring( 2, 9 );

		const toast = {
			id,
			message,
			severity,
			position: position ?? defaultOptions.position,
			duration: duration ?? defaultOptions.duration,
		};

		console.log( 'Showing toast:', toast );

		setToasts( ( prevToasts ) => [ ...prevToasts, toast ] );
	};

	const hideToast = ( id: string ) => {
		setToasts( ( prevToasts ) =>
			prevToasts.filter( ( toast ) => toast.id !== id )
		);
	};

	return (
		<ToastContext.Provider
			value={ {
				position: defaultOptions.position,
				duration: defaultOptions.duration,
				showToast,
				hideToast,
			} }
		>
			{ children }

			{ toasts.map( ( toast ) => (
				<Snackbar
					key={ toast.id }
					open={ true }
					anchorOrigin={ toast.position }
					message={ toast.message }
					autoHideDuration={ toast.duration }
					onClose={ () => hideToast( toast.id ) }
				/>
			) ) }
		</ToastContext.Provider>
	);
};

export default ToastContext;
