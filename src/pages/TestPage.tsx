import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          🎉 ROUTING WORKS!
        </h1>
        <p className="text-2xl text-green-400 mb-8">
          If you can see this, the routing system is functioning correctly.
        </p>
        <div className="bg-gray-800 border border-green-400 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-4">Test Successful</h2>
          <p className="text-gray-300">
            This means the issue is NOT with routing, but with the specific page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
