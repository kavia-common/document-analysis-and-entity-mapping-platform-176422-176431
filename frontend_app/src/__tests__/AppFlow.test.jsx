import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

function fileFromString(name, content, type='text/plain') {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
}

test('End-to-end UI flow: upload -> poll -> download', async () => {
  render(<App />);

  // Upload
  const choose = screen.getByText(/Choose File/i);
  fireEvent.click(choose);
  const input = screen.getByLabelText('File input');
  const file = fileFromString('a.txt', 'hello');
  fireEvent.change(input, { target: { files: [file] } });

  const uploadBtn = screen.getByText(/Upload/i);
  fireEvent.click(uploadBtn);

  // Progress should render and show some label eventually
  await waitFor(() => {
    expect(screen.getByText(/Processing Progress/i)).toBeInTheDocument();
  });

  // Download button enabled after jobId set
  await waitFor(() => {
    expect(screen.getByText(/Download Report/i)).toBeEnabled();
  });
});
