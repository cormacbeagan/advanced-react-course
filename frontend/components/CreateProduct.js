import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    # which variables are getting passed in and types
    # variables are marked with $ and the ! means is required
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        # create the photo and at the same time create the relationship
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      # return data after operation
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    name: 'nice shoes',
    price: 3499,
    description: 'very nice pair of shoes',
    image: '',
  }); //* needs dummy data otherwise error: controlled to uncontrolled

  const [createProduct, { data, error, loading }] = useMutation(
    // returns an async function to use plus the return data or error and status
    CREATE_PRODUCT_MUTATION,
    {
      // note that you can also pass the variables when you use createProject
      variables: inputs, // this passes all the variables and gql will destructure as they are all named appropriately
      // to update the data cached by apollo to include the new item
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
      // note that you can also just add the returned data to the apollo cache without going back to the db
    }
  );
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        // submit the inputs // createProduct will return data here aswell as above
        // doesn't need arguments as they are defined above
        const res = await createProduct();
        clearForm();
        Router.push({
          pathname: `/product/${res.data.createProduct.id}`,
        });
      }}
    >
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image
          <input
            required
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>{' '}
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
      </fieldset>
      <button type="submit">Add Product</button>
    </Form>
  );
}
