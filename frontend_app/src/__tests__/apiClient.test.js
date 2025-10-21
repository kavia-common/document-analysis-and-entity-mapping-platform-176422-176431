import { apiUploadFile, apiGetJobStatus, apiGetEntities, apiGetTaxonomy, apiPostTaxonomyMap, apiDownloadReport } from '../api/client';

function fileFromString(name, content, type='text/plain') {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
}

test('apiUploadFile returns job_id', async () => {
  const f = fileFromString('a.txt', 'hello');
  const res = await apiUploadFile(f);
  expect(res.id).toBeGreaterThan(0);
});

test('apiGetJobStatus returns status fields', async () => {
  const s = await apiGetJobStatus(1);
  expect(s.status).toBeDefined();
});

test('apiGetEntities returns entities array', async () => {
  const r = await apiGetEntities(1);
  expect(r.entities).toBeInstanceOf(Array);
});

test('apiGetTaxonomy returns structure', async () => {
  const t = await apiGetTaxonomy();
  expect(t.l1).toBeInstanceOf(Array);
});

test('apiPostTaxonomyMap posts mappings', async () => {
  const r = await apiPostTaxonomyMap(1, [{ entityId: 1, l1: 'Applications', l2: 'Web', l3: 'Frontend' }]);
  expect(r.success).toBe(true);
});

test('apiDownloadReport returns blob', async () => {
  const b = await apiDownloadReport(1);
  expect(b).toBeInstanceOf(Blob);
});
