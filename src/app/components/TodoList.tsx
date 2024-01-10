"use client"

import React, { FC } from 'react';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import TodoItem from './TodoItem';
import { v4 as uuidv4 } from 'uuid';

export class Task {
    public id: string;
    public children: Task[];
    constructor(public task: string, public completed: boolean = false, children?: Task[]) {
        this.id = uuidv4();
        this.children = children ?? [];
    }
}

const tasksAtom = atomWithStorage<Array<Task>>('tasks', []);
const newTaskAtom = atom('');
const settingsAtom = atom(false);

const TodoList: FC = () => {
    const [tasks, setTasks] = useAtom(tasksAtom);
    const [newTask, setNewTask] = useAtom(newTaskAtom);
    const [settings, setSettings] = useAtom(settingsAtom);

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, new Task(newTask)]);
            setNewTask('');
        }
    };

    const removeTask = (id: string) => {
        const remove = (tasks: Task[]): Task[] => {
            return tasks.reduce<Task[]>((acc, task) => {
                if (task.id === id) return acc;
                return [...acc, {...task, children: remove(task.children)}];
            }, []);
        }
        setTasks(remove(tasks));
    };

    const completeTask = (id: string) => {
        const complete = (tasks: Task[]): Task[] => {
            return tasks.map(task => task.id === id ? {...task, completed: true} : {...task, children: complete(task.children)});
        }
        setTasks(complete(tasks));
    }

    const addChildTask = (parentId: string, childTask: string) => {
        const add = (tasks: Task[]): Task[] => {
            return tasks.map(task => task.id === parentId ? {...task, children: [...task.children, new Task(childTask)]} : {...task, children: add(task.children)});
        }
        setTasks(add(tasks));
    };

    return (
        <div className="p-4">
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings} onChange={(e) => setSettings(e.target.checked)}/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium">Show Completed Tasks</span>
            </label>

            <input
                type="text"
                placeholder="Add a task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                className="p-2 border rounded w-full mb-8"
            />
            <div>
                {tasks.filter(task => !task.completed || settings).map(task => (
                    <TodoItem
                        key={task.id}
                        task={task}
                        toggleCompletion={completeTask}
                        removeTask={removeTask}
                        addChildTask={addChildTask}
                    />
                ))}
            </div>
        </div>
    );
};

export default TodoList;
