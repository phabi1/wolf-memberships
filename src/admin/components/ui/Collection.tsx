import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import {
	DragDropContext,
	Draggable,
	Droppable,
	OnDragEndResponder,
} from 'react-beautiful-dnd';

export type UiCollectionProps = {
	items: any[];
	renderItem: ( item: any, index: number ) => React.ReactNode;
	onAddItem?: () => void;
	onRemoveItem?: ( index: number ) => void;
	onItemClicked?: ( index: number ) => void;
	onMoveItems?: ( items: any[] ) => void;
	addLabel?: string;
	emptyText?: string;
};

export default function UiCollection( {
	items,
	renderItem,
	onAddItem,
	onRemoveItem,
	onItemClicked,
	onMoveItems,
	addLabel,
	emptyText,
}: UiCollectionProps ) {
	const handleDragEnd: OnDragEndResponder = ( result: any ) => {
		if ( ! result.destination ) {
			return;
		}
		const reorderedItems = Array.from( items );
		const [ removed ] = reorderedItems.splice( result.source.index, 1 );
		reorderedItems.splice( result.destination.index, 0, removed );
		if ( onMoveItems ) {
			onMoveItems( reorderedItems );
		}
	};
	return (
		<DragDropContext onDragEnd={ handleDragEnd }>
			<div>
				{ onAddItem && (
					<Button onClick={ onAddItem }>
						{ addLabel || 'Add Item' }
					</Button>
				) }
				<div>
					{ items.length === 0 && (
						<Box sx={ { padding: 2, textAlign: 'center' } }>
							{ emptyText || 'No items available.' }
						</Box>
					) }
					<Droppable droppableId="droppable-list">
						{ ( provided: any ) => (
							<div
								ref={ provided.innerRef }
								{ ...provided.droppableProps }
							>
								{ items.map( ( item, index ) => (
									<Draggable
										key={ index }
										draggableId={ `draggable-${ index }` }
										index={ index }
									>
										{ ( provided: any, snapshot: any ) => (
											<Stack
												direction="row"
												spacing={ 2 }
												alignItems="center"
												key={ index }
												ref={ provided.innerRef }
												sx={ {
													border: '1px solid rgb(220,220,220)',
													padding: '8px',
													marginBottom: '8px',
													borderRadius: '4px',
													...( snapshot.isDragging
														? {
																background:
																	'rgb(235,235,235)',
														  }
														: {} ),
												} }
												onClick={ () =>
													onItemClicked &&
													onItemClicked( index )
												}
												{ ...provided.draggableProps }
											>
												{ onMoveItems && (
													<Box
														style={ {
															cursor: 'move',
														} }
														{ ...provided.dragHandleProps }
													>
														<DragIndicatorIcon />
													</Box>
												) }
												<Box sx={ { flex: 1 } }>
													{ renderItem(
														item,
														index
													) }
												</Box>
												<Box>
													{ onRemoveItem && (
														<IconButton
															onClick={ () =>
																onRemoveItem(
																	index
																)
															}
														>
															<CloseIcon />
														</IconButton>
													) }
												</Box>
											</Stack>
										) }
									</Draggable>
								) ) }
								{ provided.placeholder }
							</div>
						) }
					</Droppable>
				</div>
			</div>
		</DragDropContext>
	);
}
