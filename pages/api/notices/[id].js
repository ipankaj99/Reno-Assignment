import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const notice = await prisma.notice.findUnique({ where: { id } });
      if (!notice) return res.status(404).json({ error: 'Notice not found' });
      return res.status(200).json(notice);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch notice' });
    }
  } 
  
  else if (req.method === 'PUT') {
    const { title, body, category, priority, publishDate, image } = req.body;

    // Server-side validation
    if (!title || !body || !category || !priority || !publishDate) {
      return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    try {
      const notice = await prisma.notice.update({
        where: { id },
        data: {
          title,
          body,
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image || null,
        },
      });
      return res.status(200).json(notice);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update notice' });
    }
  } 
  
  else if (req.method === 'DELETE') {
    try {
      await prisma.notice.delete({ where: { id } });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete notice' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}