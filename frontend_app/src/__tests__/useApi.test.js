import { renderHook, act } from '@testing-library/react';
import { useApi } from '../hooks/useApi';

function fileFromString(name, content, type='text/plain') {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
}

test('useApi upload and poll flow', async () => {
  const { result } = renderHook(() => useApi());
  const file = fileFromString('a.txt', 'hello app');

  await act(async () => {
    const jid = await result.current.upload(file);
    expect(jid).toBeTruthy();
    await result.current.pollStatus(jid, 10);
  });

  expect(result.current.status?.status).toBeDefined();
});

test('useApi load entities and taxonomy', async () => {
  const { result } = renderHook(() => useApi());

  await act(async () => {
    await result.current.loadEntities(1);
    await result.current.loadTaxonomy();
  });

  expect(result.current.entities).toBeInstanceOf(Array);
  expect(result.current.taxonomy).not.toBeNull();
});

test('useApi saveMappings and downloadReport', async () => {
  const { result } = renderHook(() => useApi());

  await act(async () => {
    await result.current.saveMappings(1, [{ entityId: 1, l1: 'Applications', l2: 'Web', l3: 'Frontend' }]);
    const blob = await result.current.downloadReport(1);
    expect(blob).toBeInstanceOf(Blob);
  });
});
