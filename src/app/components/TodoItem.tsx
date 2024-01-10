import React, { FC, useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Task } from './TodoList';

interface TodoItemProps {
    task: Task;
    toggleCompletion: (id: string) => void;
    removeTask: (id: string) => void;
    addChildTask: (parent: string, childTask: string) => void;
    showCompleted: boolean;
}

const TodoItem: FC<TodoItemProps> = ({ task, toggleCompletion, removeTask, addChildTask, showCompleted }) => {
    const [addingChild, setAddingChild] = useState(false);
    const [childTask, setChildTask] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [treeOpen, setTreeOpen] = useState(true);

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
        <ul>
            <li className="flex justify-between border-b mb-2">
                <span>
                    <button className="text-xl w-10" onClick={() => setTreeOpen(!treeOpen)}>
                        {
                            (task.children.length !== 0) &&
                            (treeOpen
                                ? <i className="fa-solid fa-caret-down"></i>
                                : <i className="fa-solid fa-caret-right"></i>
                            )
                        }
                    </button>
                </span>
                <span className={clsx('grow', { 'line-through': task.completed })}>{task.task}</span>
                <span>{task.completedAt?.toLocaleString() || ""}</span>
                <span>
                    <button onClick={(e) => toggleCompletion(task.id)} className={
                        clsx('text-xl', 'mr-3', {
                            'text-green-500': task.completed,
                        })}>
                        <i className="fa-solid fa-check"></i>
                    </button>
                    <button onClick={() => setAddingChild(true)} className="text-xl mr-3">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                    <button onClick={(e) => removeTask(task.id)} className="text-xl mr-1">
                        <i className="fa-solid fa-delete-left"></i>
                    </button>
                </span>
            </li>
            {treeOpen && (
                <li className="ml-5">
                    {task.children.filter(task => !task.completed || showCompleted).map(child => (
                        <TodoItem
                            key={child.id}
                            task={child}
                            toggleCompletion={toggleCompletion}
                            removeTask={removeTask}
                            addChildTask={addChildTask}
                            showCompleted={showCompleted}
                        />
                    ))}
                </li>
            )}
            {addingChild && (
                <li className='ml-5'>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Add a child task"
                        value={childTask}
                        onChange={(e) => setChildTask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddChild()}
                        className="p-2 border w-full rounded dark:bg-slate-800 dark:text-slate-200"
                    />
                </li>
            )}
        </ul>
    );
};

export default TodoItem;
