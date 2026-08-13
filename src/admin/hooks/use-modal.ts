import { useState } from 'react';

export default function useModal() {
	const [ isOpen, setIsOpen ] = useState( false );

	const openModal = () => setIsOpen( true );
	const closeModal = () => {
		setIsOpen( false );
		console.log( 'Modal closed' );
	};

	return {
		isOpen,
		openModal,
		closeModal,
	};
}
