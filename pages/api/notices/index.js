import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          // 'Urgent' > 'Normal' alphabetically, so desc sorts Urgent to the top
          { priority: 'desc' }, 
          // Secondary sort: newest first
          { publishDate: 'desc' }
        ]
      });
      return res.status(200).json(notices);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch notices' });
    }
  } 
  
  else if (req.method === 'POST') {
    const { title, body, category, priority, publishDate, image } = req.body;

    // Server-side validation
    if (!title || !body || !category || !priority || !publishDate) {
      return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    try {
      const notice = await prisma.notice.create({
        data: {
          title,
          body,
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image || null,
        },
      });
      return res.status(201).json(notice);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create notice' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}