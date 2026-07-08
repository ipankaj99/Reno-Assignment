import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function Form() {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '', body: '', category: 'General', priority: 'Normal', publishDate: '', image: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      axios.get(`/api/notices/${id}`).then((res) => {
        const data = res.data;
        // Format date for the HTML date input (YYYY-MM-DD)
        const formattedDate = new Date(data.publishDate).toISOString().split('T')[0];
        setFormData({ ...data, publishDate: formattedDate, image: data.image || '' });
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditing ? 'Edit Notice' : 'Create Notice'}
        </h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Body *</label>
            <textarea name="body" required rows="4" value={formData.body} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-2"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white">
                <option value="General">General</option>
                <option value="Event">Event</option>
                <option value="Exam">Exam</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white">
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Publish Date *</label>
            <input type="date" name="publishDate" required value={formData.publishDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded p-2" placeholder="https://..." />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link href="/" className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancel</Link>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}