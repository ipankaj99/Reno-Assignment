import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function Form() {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'General',
    priority: 'Normal',
    publishDate: '',
    image: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      axios
        .get(`/api/notices/${id}`)
        .then((res) => {
          const data = res.data;

          const formattedDate = data.publishDate
            ? new Date(data.publishDate).toISOString().split('T')[0]
            : '';

          setFormData({
            title: data.title || '',
            body: data.body || '',
            category: data.category || 'General',
            priority: data.priority || 'Normal',
            publishDate: formattedDate,
            image: data.image || '',
          });
        })
        .catch(() => {
          setError('Failed to load notice');
        });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await axios.put(`/api/notices/${id}`, formData);
      } else {
        await axios.post('/api/notices', formData);
      }

      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Notices
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Top Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? 'Edit Notice' : 'Create New Notice'}
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Fill in the details below and save your notice.
            </p>
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title *
                </label>

                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter notice title"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description *
                </label>

                <textarea
                  name="body"
                  rows={6}
                  required
                  value={formData.body}
                  onChange={handleChange}
                  placeholder="Write your notice details..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Category + Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="General">General</option>
                    <option value="Event">Event</option>
                    <option value="Exam">Exam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Publish Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Publish Date *
                </label>

                <input
                  type="date"
                  name="publishDate"
                  required
                  value={formData.publishDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Preview */}
              {formData.image && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Image Preview
                  </label>

                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-56 object-cover rounded-xl border border-slate-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
                <Link
                  href="/"
                  className="px-5 py-3 rounded-lg border border-slate-300 text-slate-700 text-center hover:bg-slate-50 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Saving...' : 'Save Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}