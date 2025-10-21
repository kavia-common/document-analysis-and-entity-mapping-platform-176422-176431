import { render, screen, fireEvent } from '@testing-library/react';
import EntityTable from '../components/EntityTable';

const sample = [
  { id: 1, type: 'application', name: 'AppOne', value: 'AppOne' },
  { id: 2, type: 'domain', name: 'Data', value: 'Data' },
];

test('EntityTable renders groups and allows inline edit', () => {
  const onChange = jest.fn();
  render(<EntityTable entities={sample} onChange={onChange} />);

  expect(screen.getByText('application')).toBeInTheDocument();
  expect(screen.getByText('domain')).toBeInTheDocument();

  const editName = screen.getAllByTitle('Edit name')[0];
  fireEvent.click(editName);

  const input = screen.getByDisplayValue('AppOne');
  fireEvent.change(input, { target: { value: 'AppUno' } });

  const save = screen.getByText('Save');
  fireEvent.click(save);

  expect(onChange).toHaveBeenCalled();
});
