import React, { FC, useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Task } from './TodoList';
import { TreeItems } from 'dnd-kit-sortable-tree';

interface TodoItemProps {
    task: TreeItems<Task>;
    toggleCompletion: (id: string) => void;
    removeTask: (id: string) => void;
    addChildTask: (parent: string, childTask: string) => void;
    showCompleted: boolean;
}

const TodoItem: FC<TodoItemProps> = ({ task, toggleCompletion, removeTask, addChildTask, showCompleted }) => {
    const [addingChild, setAddingChild] = useState(false);
    const [childTask, setChildTask] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddChild = () => {
        if (childTask.trim()) {
            addChildTask(task.id, childTask);
            setChildTask('');
            inputRef.current?.focus();
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setAddingChild(false);
                setChildTask('');
            }
        };

        const handleBlur = () => {
            if (!childTask.trim()) {
                setAddingChild(false);
            }
        };

        const inputElement = inputRef.current;
        if (inputElement) {
            inputElement.focus();
            inputElement.addEventListener('keydown', handleKeyDown);
            inputElement.addEventListener('blur', handleBlur);
        }

        return () => {
            if (inputElement) {
                inputElement.removeEventListener('keydown', handleKeyDown);
                inputElement.removeEventListener('blur', handleBlur);
            }
        };
    }, [addingChild, childTask]);

    return (
        <div className={clsx("bg-slate-100", "dark:bg-slate-900", "text-slate-900", "dark:text-slate-100", "w-full")}>
            {(!task.completed || showCompleted) && (<div className="flex justify-between border-b py-2 hover:bg-slate-200 dark:hover:bg-slate-800">
                <span>
                    <button onClick={(e) => toggleCompletion(task.id)} className={
                        clsx('text-xl', 'mr-3')}>
                        {
                            task.completed
                                ? <i className="fa-regular fa-circle-check text-green-500"></i>
                                : <i className="fa-regular fa-circle"></i>
                        }
                    </button>
                </span>
                <span className={clsx('grow', { 'line-through': task.completed })}>{task.task}</span>
                <span>{task.completedAt?.toLocaleString() || ""}</span>
                <span>
                    <button onClick={() => setAddingChild(true)} className="text-xl mr-3">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                    <button onClick={(e) => removeTask(task.id)} className="text-xl mr-1">
                        <i className="fa-solid fa-delete-left"></i>
                    </button>
                </span>
            </div>)}
            {addingChild && (
                <div className='ml-5'>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Add a child task"
                        value={childTask}
                        onChange={(e) => setChildTask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddChild()}
                        className="p-2 border w-full rounded dark:bg-slate-800 dark:text-slate-200"
                    />
                </div>
            )}
        </div>
    );
};

export default TodoItem;
