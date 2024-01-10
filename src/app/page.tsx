import React, { FC } from 'react';
import TodoList from './components/TodoList';

const Home: FC = () => {
    return (
        <div className="container mx-auto p-8 max-w-screen-xl">
            <h1 className="text-2xl mb-4 text-center">Task Tree</h1>
            <TodoList />
        </div>
    );
};

export default Home;
