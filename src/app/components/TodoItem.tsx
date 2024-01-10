import React, { FC, useState, useRef, useEffect } from 'react';
import { Task } from './TodoList';

interface TodoItemProps {
    task: Task;
    toggleCompletion: (id: string) => void;
    removeTask: (id: string) => void;
    addChildTask: (parent: string, childTask: string) => void;
}

const TodoItem: FC<TodoItemProps> = ({ task, toggleCompletion, removeTask, addChildTask }) => {
    const [addingChild, setAddingChild] = useState(false);
    const [childTask, setChildTask] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddChild = () => {
        if (childTask.trim()) {
            addChildTask(task.id, childTask);
            setChildTask('');
            setAddingChild(false);
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
        <div>
            <div className="flex justify-between p-2 border-b bg-white mb-5">
                <span>{task.task}</span>
                <span>
                    <button onClick={(e) => toggleCompletion(task.id)} className="text-xl">
                        ✓
                    </button>
                    <button onClick={() => setAddingChild(true)} className="text-xl">
                        +
                    </button>
                    <button onClick={(e) => removeTask(task.id)} className="text-xl">
                        🗑
                    </button>
                </span>
            </div>
            {addingChild && (
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Add a child task"
                    value={childTask}
                    onChange={(e) => setChildTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddChild()}
                    className="p-2 border rounded w-full mb-8 ml-5"
                />
            )}
            <div className="ml-5">
                {task.children.map(child => (
                    <TodoItem
                        key={child.id}
                        task={child}
                        toggleCompletion={toggleCompletion}
                        removeTask={removeTask}
                        addChildTask={addChildTask}
                    />
                ))}
            </div>
        </div>
    );
};

export default TodoItem;
