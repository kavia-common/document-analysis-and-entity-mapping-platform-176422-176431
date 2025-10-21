import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadPanel from '../components/UploadPanel';

function fileFromString(name, content, type='text/plain') {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
}

test('UploadPanel validates and triggers onUpload', async () => {
  const onUpload = jest.fn().mockResolvedValue(1);
  render(<UploadPanel onUpload={onUpload} />);

  const chooseBtn = screen.getByText(/Choose File/i);
  fireEvent.click(chooseBtn);

  // Since input is hidden, query it directly
  const input = screen.getByLabelText('File input');
  const file = fileFromString('doc.txt', 'hello');
  await waitFor(() => {
    fireEvent.change(input, { target: { files: [file] } });
  });

  const uploadBtn = screen.getByText(/Upload/i);
  fireEvent.click(uploadBtn);

  await waitFor(() => expect(onUpload).toHaveBeenCalled());
});
