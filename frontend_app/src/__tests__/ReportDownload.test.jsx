import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReportDownload from '../components/ReportDownload';

beforeAll(() => {
  // mock createObjectURL
  global.URL.createObjectURL = jest.fn(() => 'blob:mock');
  global.URL.revokeObjectURL = jest.fn();
});

test('ReportDownload disables without job and triggers onDownload', async () => {
  const onDownload = jest.fn().mockResolvedValue(new Blob(['xlsx']));

  const { rerender } = render(<ReportDownload jobId={null} onDownload={onDownload} />);
  const button = screen.getByText(/Download Report/i);
  expect(button).toBeDisabled();

  rerender(<ReportDownload jobId={1} onDownload={onDownload} />);
  const button2 = screen.getByText(/Download Report/i);
  expect(button2).not.toBeDisabled();

  fireEvent.click(button2);
  await waitFor(() => expect(onDownload).toHaveBeenCalled());
});
