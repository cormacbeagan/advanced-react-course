import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import Pagination from '../components/Pagination';
import { makePaginationMocksFor } from '../lib/testUtils';

describe('<Pagination />', () => {
  it('displays a loading message', () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(1)}>
        <Pagination />
      </MockedProvider>
    );
    expect(container).toHaveTextContent('Loading...');
  });
  it('renders pagination for 18 items', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await new Promise((resolve) => setTimeout(resolve, 0)); // works
    // await screen.findByTestId('pagination');
    expect(container).toHaveTextContent('Page 1 of 9');
    const pageCountSpan = screen.getByTestId('pageCount');
    expect(pageCountSpan).toHaveTextContent('9');
    expect(container).toMatchSnapshot();
  });

  it('disables the prev btn on first page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(6)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    // await screen.findByTestId('pagination');
    await new Promise((resolve) => setTimeout(resolve, 0)); // works
    const prevBtn = screen.getByText(/Prev/);
    const nextBtn = screen.getByText(/Next/);
    expect(prevBtn).toHaveAttribute('aria-disabled', 'true');
    expect(nextBtn).toHaveAttribute('aria-disabled', 'false');
  });
  it('disables the next btn on last page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(6)}>
        <Pagination page={3} />
      </MockedProvider>
    );
    // await screen.findByTestId('pagination');
    await new Promise((resolve) => setTimeout(resolve, 0)); // works
    const prevBtn = screen.getByText(/Prev/);
    const nextBtn = screen.getByText(/Next/);
    expect(prevBtn).toHaveAttribute('aria-disabled', 'false');
    expect(nextBtn).toHaveAttribute('aria-disabled', 'true');
  });
  it('enables all on middle page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(6)}>
        <Pagination page={2} />
      </MockedProvider>
    );
    // await screen.findByTestId('pagination');
    await new Promise((resolve) => setTimeout(resolve, 0)); // works
    const prevBtn = screen.getByText(/Prev/);
    const nextBtn = screen.getByText(/Next/);
    expect(prevBtn).toHaveAttribute('aria-disabled', 'false');
    expect(nextBtn).toHaveAttribute('aria-disabled', 'false');
  });
});
