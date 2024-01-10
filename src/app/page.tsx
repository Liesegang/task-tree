import React from 'react';
import TodoList from './components/TodoList';

// Todoアプリの中身
const Home = () => {
    return (
        <div className="container mx-auto p-8 max-w-screen-xl">
            <h1 className="text-2xl mb-4 text-center">Todo App</h1>
            <TodoList />
        </div>
    );
};

export default Home;
