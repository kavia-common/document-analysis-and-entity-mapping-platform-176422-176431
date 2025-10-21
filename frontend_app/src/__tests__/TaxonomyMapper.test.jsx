import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaxonomyMapper from '../components/TaxonomyMapper';

const entities = [{ id: 1, type: 'application', name: 'AppOne', value: 'AppOne' }];
const taxonomy = {
  l1: ['Applications'],
  l2: { 'Applications': ['Web'] },
  l3: { 'Applications::Web': ['Frontend'] },
};

test('TaxonomyMapper allows selecting L1 L2 L3 and save', async () => {
  const onSave = jest.fn().mockResolvedValue({ success: true });
  render(<TaxonomyMapper entities={entities} taxonomy={taxonomy} onSave={onSave} />);

  fireEvent.change(screen.getByDisplayValue('Select L1'), { target: { value: 'Applications' } });
  fireEvent.change(screen.getByDisplayValue('Select L2'), { target: { value: 'Web' } });
  fireEvent.change(screen.getByDisplayValue('Select L3'), { target: { value: 'Frontend' } });

  fireEvent.click(screen.getByText(/Save Mappings/i));

  await waitFor(() => expect(onSave).toHaveBeenCalled());
});
