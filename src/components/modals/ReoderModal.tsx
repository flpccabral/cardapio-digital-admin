"use client"

import { Modal } from "@/components/ui/modal"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable, DropResult} from "react-beautiful-dnd"

export type ReoderType = {
    id: string;
    name: string;
    order: number;
}

interface ReoderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: ReoderType[]) => void;
    loading: boolean;
    initialData: ReoderType[]
}

export const ReoderModal: React.FC<ReoderModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    initialData
}) => {
    const [data, setData] = useState<ReoderType[]>(initialData);
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    if (!isMounted) {
        return null;
    }
    
    const handleDragDrop = (results: DropResult) => {
        const { source, destination, type} = results;
        
        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        if (type === 'group') {
            const reorderData = [...data];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;

            const [removedData] = reorderData.splice(sourceIndex, 1);
            reorderData.splice(destinationIndex, 0, removedData);

            return setData(reorderData)
        }
    }

    return (
        <Modal
            title="Reordenar"
            // description="Essa ação não pode ser desfeita"
            isOpen={isOpen}
            onClose={onClose}
        >   
            <div className="overflow-y-auto max-h-[60vh]">
            <DragDropContext onDragEnd={handleDragDrop}>
                <Droppable droppableId="ROOT" type="group">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {data.map((item, index) => (
                                <Draggable isDragDisabled={loading} draggableId={item.id} key={item.id} index={index}>
                                    {(provided) => (
                                        <div 
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                            ref={provided.innerRef}
                                            style={{...provided.draggableProps.style}}
                                            className="flex justify-between items-center gap-16 w-full p-2 border bg-white mb-2 shadow rounded"
                                        >
                                            <span>
                                                {item.name}
                                            </span>
                                            <div className="font-bold">
                                                ::
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            </div>
            <div className="pt-6 space-x-2 flex items-center justify-end flex-wrap-reverse w-full">
                <Button
                    disabled={loading}
                    variant="outline"
                    onClick={onClose}
                >
                    Cancelar
                </Button>
                <Button
                    disabled={loading}
                    onClick={() => onConfirm(data)}
                >
                    Confirmar
                </Button>
            </div>
        </Modal>
    )
}