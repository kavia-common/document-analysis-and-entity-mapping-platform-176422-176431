import { http, HttpResponse } from 'msw';

let jobIdCounter = 1;
let statusByJob = new Map();

export const handlers = [
  http.post('/uploads', async ({ request }) => {
    const id = jobIdCounter++;
    statusByJob.set(String(id), { status: 'queued', progress: 0, stage: 'queued' });
    return HttpResponse.json({ id, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), status: 'queued', filename: 'x', storage_path: '/tmp/x' });
  }),

  http.get('/jobs/:id/status', ({ params }) => {
    const id = String(params.id);
    const s = statusByJob.get(id) || { status: 'queued', progress: 0, stage: 'queued' };
    // advance to completed on subsequent calls
    if (s.status !== 'completed') {
      s.status = 'completed';
      s.progress = 100;
      s.stage = 'completed';
      statusByJob.set(id, s);
    }
    return HttpResponse.json(s);
  }),

  http.get('/jobs/:id/entities', ({ params }) => {
    const id = String(params.id);
    return HttpResponse.json({
      entities: [
        { id: 1, type: 'application', name: 'AppOne', value: 'AppOne' },
        { id: 2, type: 'domain', name: 'Data', value: 'Data' },
      ]
    });
  }),

  http.get('/taxonomy', () => {
    return HttpResponse.json({
      l1: ['Applications', 'Domains'],
      l2: { 'Applications': ['Web'], 'Domains': ['Security'] },
      l3: { 'Applications::Web': ['Frontend', 'Backend'], 'Domains::Security': ['IAM'] },
    });
  }),

  http.post('/jobs/:id/taxonomy/map', async ({ request }) => {
    const body = await request.json();
    if (!body || !body.mappings) {
      return new HttpResponse(JSON.stringify({ detail: 'Invalid payload' }), { status: 400 });
    }
    return HttpResponse.json({ success: true });
  }),

  http.get('/jobs/:id/report', ({ params }) => {
    // return a small blob-like response
    return new HttpResponse(new Blob(['xlsx-bytes']), {
      status: 200,
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    });
  }),
];
