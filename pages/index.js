import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const res = await axios.get('/api/notices');
      setNotices(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this notice?'
    );

    if (!confirmed) return;

    try {
      await axios.delete(`/api/notices/${id}`);
      fetchNotices();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold">Reno Notice Board</h1>
              <p className="mt-2 text-blue-100">
                Manage announcements, events, exams, and important updates.
              </p>
            </div>

            <Link
              href="/form"
              className="inline-flex items-center justify-center bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold shadow hover:shadow-lg transition"
            >
              + Create Notice
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Notices</p>
              <h2 className="text-3xl font-bold text-slate-800">
                {notices.length}
              </h2>
            </div>

            <div className="text-5xl">📢</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">
              No Notices Yet
            </h2>
            <p className="text-slate-500 mb-6">
              Create your first notice to get started.
            </p>

            <Link
              href="/form"
              className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Create Notice
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-slate-200"
              >
                {notice.image && (
                  <img
                    src={notice.image}
                    alt={notice.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {notice.category}
                    </span>

                    {notice.priority === 'Urgent' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                        Urgent
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                        Normal
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                    {notice.title}
                  </h2>

                  <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                    {notice.body}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span>
                      {new Date(notice.publishDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <Link
                      href={`/form?id=${notice.id}`}
                      className="flex-1 text-center py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}