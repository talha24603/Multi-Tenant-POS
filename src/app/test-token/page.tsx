"use client"
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function TestTokenPage() {
  const { data: session } = useSession();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const fetchDebugInfo = async () => {
    try {
      const response = await fetch('/api/debug/tenant-status');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Error fetching debug info:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Token Debug Information</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Session Information</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <button 
        onClick={fetchDebugInfo}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Fetch Debug Info
      </button>

      {debugInfo && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Debug API Response</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

