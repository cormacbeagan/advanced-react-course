import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import wait from 'waait';
import userEvent from '@testing-library/user-event';
import SignUp, { SIGNUP_MUTATION } from '../components/SignUp';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

const me = fakeUser();
const password = 'aPassword';

const mocks = [
  //* mutation mock
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: { name: me.name, email: me.email, password },
    },
    result: {
      data: {
        __typename: 'User',
        id: 'abc123',
        name: me.name,
        email: me.email,
      },
    },
  },
  //* Current user mock
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: me } },
  },
];

describe('<SignUp />', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('calls the mutation properly', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SignUp />
      </MockedProvider>
    );
    await userEvent.type(screen.getByPlaceholderText(/name/i), me.name);
    await userEvent.type(screen.getByPlaceholderText(/email/i), me.email);
    await userEvent.type(screen.getByPlaceholderText(/password/i), password);
    await userEvent.click(screen.getByText('Sign Up'));
    // doesn't work somehow the mocked mutation is not getting the createUser data back in <SignUp />
    await screen.findByText(
      `Signed up with ${me.email} - Please go ahead and sign in`
    );
  });
});
