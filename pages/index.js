import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const [notices, setNotices] = useState([]);

  const fetchNotices = async () => {
    const res = await axios.get('/api/notices');
    setNotices(res.data);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      await axios.delete(`/api/notices/${id}`);
      fetchNotices(); // Refresh the list
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Reno Notice Board</h1>
          <Link href="/form" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            + Add Notice
          </Link>
        </div>

        {notices.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No notices found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white rounded-lg shadow-md p-5 flex flex-col relative border border-gray-100">
                {notice.priority === 'Urgent' && (
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                    URGENT
                  </span>
                )}
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{notice.category}</span>
                  <span className="text-xs text-gray-500">{new Date(notice.publishDate).toLocaleDateString()}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{notice.title}</h2>
                {notice.image && <img src={notice.image} alt="Notice" className="w-full h-32 object-cover rounded mb-3" />}
                <p className="text-gray-600 text-sm flex-grow mb-4 whitespace-pre-wrap line-clamp-3">{notice.body}</p>
                
                <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-gray-100">
                  <Link href={`/form?id=${notice.id}`} className="text-sm text-blue-500 hover:text-blue-700 font-medium">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(notice.id)} className="text-sm text-red-500 hover:text-red-700 font-medium ml-2">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}