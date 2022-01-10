import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import styles from './Kitchen.module.scss';

const orders = [
  {
    address: '',
    phone: '',
    totalPrice: 38,
    subtotalPrice: 18,
    totalNumber: 2,
    deliveryFee: 20,
    products: [
      {
        id: 'cake',
        amount: 2,
        price: 18,
        priceSingle: 9,
        name: 'Zio Stefano\'s Doughnut',
        params: {},
      },
    ],
    id: 1,
  },
  {
    address: '',
    phone: '',
    totalPrice: 49,
    subtotalPrice: 29,
    totalNumber: 2,
    deliveryFee: 20,
    products: [
      {
        id: 'breakfast',
        amount: 1,
        price: 9,
        priceSingle: 9,
        name: 'Zia Giulia\'s Breakfast',
        params: {
          coffee: {
            label: 'Coffee type',
            options: {
              latte: 'Latte',
            },
          },
        },
      },
      {
        id: 'pizza',
        amount: 1,
        price: 20,
        priceSingle: 20,
        name: 'Nonna Alba\'s Pizza',
        params: {
          sauce: {
            label: 'Sauce',
            options: {
              tomato: 'Tomato',
            },
          },
          toppings: {
            label: 'Toppings',
            options: {
              olives: 'Olives',
              redPeppers: 'Red peppers',
              greenPeppers: 'Green peppers',
              mushrooms: 'Mushrooms',
              basil: 'Fresh basil',
            },
          },
          crust: {
            label: 'pizza crust',
            options: {
              standard: 'standard',
            },
          },
        },
      },
    ],
    id: 2,
  },
  {
    address: '',
    phone: '',
    totalPrice: 27,
    subtotalPrice: 7,
    totalNumber: 1,
    deliveryFee: 20,
    products: [
      {
        id: 'salad',
        amount: 1,
        price: 7,
        priceSingle: 7,
        name: 'Nonno Alberto\'s Salad',
        params: {
          ingredients: {
            label: 'Ingredients',
            options: {
              cucumber: 'Cucumber',
              cheese: 'Cheese',
            },
          },
        },
      },
    ],
    id: 3,
  },
];

const compare = (prev, next) => (
  prev.id - next.id
);

const Kitchen = () => {
  const [ordersList, setOrdersList] = useState(JSON.parse(JSON.stringify(orders)).sort(compare));
  return (
    <Paper className={styles.component}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order id</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Options</TableCell>
            <TableCell>Mark as done</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ordersList.map((order, ordersIndex) => (
            order.products.map((product, productsIndex) => (
              <TableRow key={order.id + product.id}>
                {!productsIndex && (
                  <TableCell
                    rowSpan={order.products.length}
                    component="th"
                    scope="row"
                  >
                    {order.id}
                  </TableCell>
                )}
                <TableCell>
                  {product.name}
                </TableCell>
                <TableCell>
                  {(product.params && Object.keys(product.params)) ? (
                    Object.keys(product.params).map(param => (
                      <p key={param}>
                        {`${product.params[param].label}: ${Object.values(product.params[param].options).join(', ')}`}
                      </p>
                    ))
                  )
                    :
                    ''
                  }
                </TableCell>
                <TableCell>
                  <Button onClick={
                    () => {
                      order.products.splice(productsIndex, 1);
                      const changedOrder = ordersList.splice(ordersIndex, 1);
                      if(changedOrder[0].products.length){
                        setOrdersList([...ordersList, {...changedOrder[0], products: changedOrder[0].products}].sort(compare));
                      } else {
                        setOrdersList([...ordersList].sort(compare));
                      }
                    }
                  }
                  >
                    <DoneIcon color="secondary"/>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Kitchen;
