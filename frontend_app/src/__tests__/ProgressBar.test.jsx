import { render, screen } from '@testing-library/react';
import ProgressBar from '../components/ProgressBar';

test('ProgressBar calls onPoll when jobId present', () => {
  const onPoll = jest.fn();
  render(<ProgressBar jobId={1} status={{ status: 'queued', progress: 0 }} onPoll={onPoll} />);
  expect(onPoll).toHaveBeenCalledWith(1);
});
