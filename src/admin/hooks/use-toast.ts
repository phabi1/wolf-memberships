import { useContext } from 'react';
import { ToastContext } from '../contexts/toast';

export default function useToast() {
	const ctx = useContext( ToastContext );

	if ( ! ctx ) {
		throw new Error( 'useToast must be used within a ToastProvider' );
	}

	return (
		message: string,
		severity: 'success' | 'error' | 'info' | 'warning',
		duration?: number
	) => {
		ctx.showToast( message, severity, duration );
	};
}
