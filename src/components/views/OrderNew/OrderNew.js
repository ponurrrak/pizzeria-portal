import React, { useState }  from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Badge from '@material-ui/core/Badge';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PropTypes from 'prop-types';
import styles from './OrderNew.module.scss';

const menu = [
  {
    id: 'cake',
    name: 'Zio Stefano\'s Doughnut',
    price: 9,
  },
  {
    id: 'breakfast',
    name: 'Zia Giulia\'s Breakfast',
    price: 9,
    params: {
      coffee: {
        label: 'Coffee type',
        type: 'radios',
        options: {
          latte: {
            label: 'Latte',
            price: 1,
            default: true,
          },
          cappuccino: {
            label: 'Cappuccino',
            price: 1,
          },
          espresso: {
            label: 'Espresso',
            price: 1,
          },
          macchiato: {
            label: 'Macchiato ',
            price: 1,
          },
        },
      },
    },
  },
  {
    id: 'pizza',
    name: 'Nonna Alba\'s Pizza',
    price: 20,
    params: {
      sauce: {
        label: 'Sauce',
        type: 'radios',
        options: {
          tomato: {
            label: 'Tomato',
            price: 0,
            default: true,
          },
          cream: {
            label: 'Sour cream',
            price: 2,
          },
        },
      },
      toppings: {
        label: 'Toppings',
        type: 'checkboxes',
        options: {
          olives: {
            label: 'Olives',
            price: 2,
            default: true,
          },
          redPeppers: {
            label: 'Red peppers',
            price: 2,
            default: true,
          },
          greenPeppers: {
            label: 'Green peppers',
            price: 2,
            default: true,
          },
          mushrooms: {
            label: 'Mushrooms',
            price: 2,
            default: true,
          },
          basil: {
            label: 'Fresh basil',
            price: 2,
            default: true,
          },
          salami: {
            label: 'Salami',
            price: 3,
          },
        },
      },
      crust: {
        label: 'Pizza crust',
        type: 'select',
        options: {
          standard: {
            label: 'standard',
            price: 0,
            default: true,
          },
          thin: {
            label: 'thin',
            price: 2,
          },
          thick: {
            label: 'thick',
            price: 2,
          },
          cheese: {
            label: 'cheese in edges',
            price: 5,
          },
          wholewheat: {
            label: 'wholewheat',
            price: 3,
          },
          gluten: {
            label: 'with extra gluten',
            price: 0,
          },
        },
      },
    },
  },
  {
    id: 'salad',
    name: 'Nonno Alberto\'s Salad',
    price: 9,
    params: {
      ingredients: {
        label: 'Ingredients',
        type: 'checkboxes',
        options: {
          cucumber: {
            label: 'Cucumber',
            price: 1,
            default: true,
          },
          tomatoes: {
            label: 'Tomatoes',
            price: 1,
            default: true,
          },
          olives: {
            label: 'Olives',
            price: 1,
            default: true,
          },
          feta: {
            label: 'Feta cheese',
            price: 1,
          },
          cheese: {
            label: 'Cheese',
            price: 1,
          },
          herbs: {
            label: 'Fresh herbs',
            price: 1,
            default: true,
          },
          pepper: {
            label: 'Black pepper',
            price: 1,
          },
        },
      },
    },
  },
];

const tablesList = Array.from({length: 6}, (item, index) => index + 1);

const sortObjectsArray = (array, key='id') => {
  array.sort((prev, next) => {
    if(prev[key] < next[key]){
      return -1;
    } else {
      return 1;
    }
  });
  return array;
};

const countOrderSums = order => {
  let totalOrder = 0;
  const totalItems = {};
  for(const orderItem of order){
    let totalItem = orderItem.price;
    if(orderItem.params){
      for(const paramKey in orderItem.params){
        const options = orderItem.params[paramKey].options;
        for(const optionKey in options){
          const option = options[optionKey];
          if(option.default && option.checked === false){
            totalItem -= option.price;
          } else if(!option.default && option.checked){
            totalItem += option.price;
          }
        }
      }
    }
    totalItem = totalItem * orderItem.amount;
    totalItems[orderItem.orderCounter] = totalItem.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    totalOrder += totalItem;
  }
  totalOrder = totalOrder.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return {...totalItems, totalOrder};
};

const renderMenu = (menuToRender, setPreOrder, order, changeOrder, orderCounter, setOrderCounter) => (
  <List disablePadding>
    {menuToRender.map(menuItem => {
      const amount = menuItem.amount ? menuItem.amount : 0;
      const otherMenuItems = menuToRender.filter(item => item.id !== menuItem.id);
      return (
        <div key={menuItem.id}>
          <ListItem className={styles.menuItem}>
            <ListItemIcon>
              <Badge color="secondary" badgeContent={amount}>
                <ShoppingCartIcon/>
              </Badge>
            </ListItemIcon>
            <ListItemText
              primary={menuItem.id}
              secondary={menuItem.name}
            />
            <ButtonGroup>
              <Button
                onClick={() => {
                  const changedMenuItem = {...menuItem, amount: Math.max(amount - 1, 0)};
                  setPreOrder(sortObjectsArray([...otherMenuItems, changedMenuItem]));
                }}
              >
                <RemoveIcon fontSize="small" />
              </Button>
              <Button
                onClick={() => {
                  const changedMenuItem = {...menuItem, amount: amount + 1};
                  setPreOrder(sortObjectsArray([...otherMenuItems, changedMenuItem]));
                }}
              >
                <AddIcon fontSize="small" />
              </Button>
            </ButtonGroup>
          </ListItem>
          {amount && menuItem.params ? renderMenuItemParams(menuItem, otherMenuItems, setPreOrder) : ''}
          <div className={styles.addToOrderButton}>
            {amount ?
              <Button
                variant="contained"
                color="primary"

                onClick={() => {
                  changeOrder([...order, {...menuItem, orderCounter}]);
                  setOrderCounter(orderCounter + 1);
                  setPreOrder(sortObjectsArray([...otherMenuItems, menu.find(item => item.id === menuItem.id)]));
                }}
              >
                Add to order
              </Button>
              :
              ''
            }
          </div>
        </div>
      );
    })}
  </List>
);

const renderMenuItemParams = (menuItem, otherMenuItems, setPreOrder) => {
  const params = menuItem.params;
  const paramsKeys = Object.keys(params).sort();
  return (
    <div className={styles.nestedList}>
      {paramsKeys.map(paramKey => {
        const options = params[paramKey].options;
        const optionsKeys = Object.keys(options).sort();
        return (
          <FormControl key={paramKey} className={styles.formControl}>
            <List
              disablePadding
              subheader={
                <ListSubheader component="div">
                  {params[paramKey].label}
                </ListSubheader>
              }
            >
              {params[paramKey].type === 'checkboxes' ?
                renderMenuCheckboxes(optionsKeys, options, paramKey, menuItem, otherMenuItems, setPreOrder)
                :
                renderMenuRadios(optionsKeys, options, paramKey, menuItem, otherMenuItems, setPreOrder)
              }
            </List>
          </FormControl>
        );
      })}
    </div>
  );
};

const renderMenuRadios = (optionsKeys, options, paramKey, menuItem, otherMenuItems, setPreOrder) => {
  let radiosValue = optionsKeys.find(key => options[key].checked);
  if(!radiosValue){
    radiosValue = optionsKeys.find(key => (options[key].checked === undefined && options[key].default));
  }
  return (
    <RadioGroup
      value={radiosValue}
      onChange= {event => {
        const changedOptions = {...options};
        for(const key in changedOptions){
          changedOptions[key].checked = false;
        }
        changedOptions[event.target.value].checked = true;
        const changedMenuItem = {...menuItem};
        changedMenuItem.params[paramKey].options = changedOptions;
        setPreOrder(sortObjectsArray([...otherMenuItems, changedMenuItem]));
      }}
    >
      {optionsKeys.map(optionKey => {
        return (
          <ListItem key={optionKey}>
            <ListItemText
              secondary={options[optionKey].label}
              className={styles.option}
            />
            <Radio value={optionKey} />
          </ListItem>
        );
      })}
    </RadioGroup>
  );
};

const renderMenuCheckboxes = (optionsKeys, options, paramKey, menuItem, otherMenuItems, setPreOrder) => (
  <FormGroup>
    {optionsKeys.map(optionKey => (
      <ListItem key={optionKey}>
        <ListItemText
          secondary={options[optionKey].label}
          className={styles.option}
        />
        <Checkbox
          checked={options[optionKey].checked || (options[optionKey].default && options[optionKey].checked === undefined)}
          onChange= {event => {
            const changedMenuItem = {...menuItem};
            changedMenuItem.params[paramKey].options[optionKey].checked = event.target.checked;
            setPreOrder(sortObjectsArray([...otherMenuItems, changedMenuItem]));
          }}
          name={optionKey}
        />
      </ListItem>
    ))}
  </FormGroup>
);

const renderOrder = (order, changeOrder) => {
  const orderSums = countOrderSums(order);
  return (
    <List disablePadding>
      {order.map((orderItem, index) => {
        return (
          <div key={index}>
            <ListItem className={styles.menuItem}>
              <ListItemText
                primary={orderItem.id}
                secondary={orderItem.name}
              />
              <ButtonGroup>
                <Button
                  onClick={() => {
                    const orderChanged = [...order];
                    orderChanged.splice(index, 1);
                    if(orderItem.amount > 1){
                      orderChanged.push({...orderItem, amount: orderItem.amount - 1});
                    }
                    changeOrder(sortObjectsArray([...orderChanged], 'orderCounter'));
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </Button>
                <Button className={styles.orderBadge}>
                  <Badge color="secondary" badgeContent={orderItem.amount}>
                    <ShoppingCartIcon/>
                  </Badge>
                </Button>
                <Button
                  onClick={() => {
                    const orderChanged = [...order];
                    orderChanged.splice(index, 1);
                    orderChanged.push({...orderItem, amount: orderItem.amount + 1});
                    changeOrder(sortObjectsArray([...orderChanged], 'orderCounter'));
                  }}
                >
                  <AddIcon fontSize="small" />
                </Button>
              </ButtonGroup>
            </ListItem>
            {orderItem.params ? renderOrderParams(orderItem) : ''}
            <Divider/>
            <Typography
              variant='overline'
              align='right'
              display='block'
              color='primary'
              className={styles.itemTotal}
            >
              {`Item total: ${orderSums[orderItem.orderCounter]}`}
            </Typography>
          </div>
        );
      })}
      <Divider className={styles.totalOrderDivider}/>
      <Typography
        variant='overline'
        align='right'
        display='block'
        color='secondary'
        className={styles.orderTotal}
      >
        {`Order total: ${orderSums.totalOrder}`}
      </Typography>
    </List>
  );
};

const renderOrderParams = orderItem => {
  const params = orderItem.params;
  const paramsKeys = Object.keys(params).sort();
  return (
    <List disablePadding>
      {paramsKeys.map(paramKey => {
        const options = params[paramKey].options;
        const optionsKeys = Object.keys(options).sort();
        const optionsSelected = optionsKeys.filter(optionKey => (
          options[optionKey].checked || (options[optionKey].default && options[optionKey].checked !== false)
        ));
        const optionsString = optionsSelected.map(optionKey => options[optionKey].label).join(', ');
        return (
          <ListItem key={paramKey} className={styles.orderParams}>
            <ListItemText
              secondary={params[paramKey].label + ': ' + optionsString}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

const OrderNew = ({location}) => {
  const orderingTable = location.state ? location.state : 1;
  const [selectedTable, setSelectedTable] = useState(orderingTable * 1);
  const handleTableChange = (event) => {
    setSelectedTable(event.target.value * 1);
  };
  const [menuToRender, setPreOrder] = useState(sortObjectsArray(JSON.parse(JSON.stringify(menu))));
  const [order, changeOrder] = useState([]);
  const [orderCounter, setOrderCounter] = useState(1);
  return (
    <Paper className={styles.component}>
      <Typography gutterBottom variant='h4'>
        Set a new order
      </Typography>
      <FormControl component='fieldset' className={styles.tableChoice}>
        <Typography gutterBottom>
          For table number:
        </Typography>
        <RadioGroup row name='table' value={selectedTable} onChange={handleTableChange}>
          {tablesList.map(table => (
            <FormControlLabel
              key={table}
              value={table}
              control={<Radio />}
              label={`table ${table}`}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Grid container
        spacing={3}
        justifyContent={order.length ? 'flex-start' : 'center'}
      >
        <Grid item className={styles.gridItem} xs={12} md={6}>
          <Typography gutterBottom variant='h5'>
            Menu
          </Typography>
          {renderMenu(menuToRender, setPreOrder, order, changeOrder, orderCounter, setOrderCounter)}
        </Grid>
        {order.length ?
          (<Grid item className={styles.gridItem} xs={12} md={6}>
            <Typography gutterBottom variant='h5'>
              Order
            </Typography>
            {renderOrder(order, changeOrder)}
          </Grid>)
          :
          ''
        }
      </Grid>
    </Paper>
  );
};

OrderNew.propTypes = {
  location: PropTypes.object,
};

export default OrderNew;
