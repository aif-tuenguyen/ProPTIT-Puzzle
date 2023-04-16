import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { Add, DeleteOutlined, Remove } from '@mui/icons-material';
import { formatter } from 'src/utils';
import productServices from 'src/services/productServices';

const HeaderCart = styled(Box)(
  ({ theme }) => `
            display: flex;
            align-items: center;
            padding: ${theme.spacing(1)};
            justify-content: space-between;
        `
);

const CartItem = styled(Box)(
  ({ theme }) => `
              display: flex;
              align-items: flex-start;
              padding: ${theme.spacing(1)};
          `
);

const CardClient = styled(Card)(
  ({ theme }) => `
        margin-top: ${theme.spacing(1)};
        margin-bottom: ${theme.spacing(1)};
      `
);

const ImgWrapper = styled('img')(
  ({ theme }) => `
          height: auto;
          width: 100px;
          object-fit: cover;
          border-radius: 10px;
    `
);

interface PriceTextProps {
  discount?: boolean;
}

const PriceText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'discount'
})<PriceTextProps>(
  ({ discount, theme }) => `
          font-weight: bold;
          color: ${discount ? '#ff4242' : 'inherit'};
      `
);

const OriginText = styled(Typography)(
  ({ theme }) => `
    text-decoration: line-through;
    font-size: 10px;
    margin-left: ${theme.spacing(1)};
    color: #747474;
        `
);

const NumberItem = styled(TextField)(
  ({ theme }) => `
    .MuiInputBase-root {
      height: 30px;
      width: 50px;
      
      input {
        text-align: center;
      }
    }
  `
);

const ButtonAction = styled(Button)(
  ({ theme }) => `
    min-width: 30px;
    width: 30px;
    height: 30px;
    `
);

interface ICartPageProps {
  selectedItems: any;
  setSelectedItems: any;
  cart: any;
  setCart: any;
  setTotalPrice: any;
  setTotalSalePrice: any;
}

const CartPage: React.FC<ICartPageProps> = ({
  selectedItems,
  setSelectedItems,
  cart,
  setCart,
  setTotalPrice,
  setTotalSalePrice
}) => {
  const cartStorage = localStorage.getItem('cart');

  const getCartProducts = async (carts: any[]) => {
    const cartProducts = await Promise.all(
      carts.map(async (c) => {
        const response = await productServices.getDetailProductClient(
          c.productId
        );
        return {
          product: response.data || null,
          quantity: c.quantity,
          campaignId: c.campaignId
        };
      })
    );

    setCart(cartProducts);
  };

  useEffect(() => {
    if (cartStorage) {
      const cartProduct = JSON.parse(cartStorage);
      getCartProducts(cartProduct);
    }
  }, [cartStorage]);

  const selectedSomeItems =
    selectedItems.length > 0 && selectedItems.length < cart.length;
  const selectedAllItems = selectedItems.length === cart.length;

  const caculateTotalPrice = (selected: any) => {
    let totalPrice = 0;
    let totalSalePrice = 0;
    cart?.forEach((item) => {
      if (selected.includes(item.product.id)) {
        totalPrice += item?.product?.price * item?.quantity;
        totalSalePrice += item?.product?.salePrice * item?.quantity;
      }
    });

    setTotalPrice(totalPrice);
    setTotalSalePrice(totalSalePrice);
  };

  const handleSelectAllItems = (event: ChangeEvent<HTMLInputElement>): void => {
    const selected = event.target.checked
      ? cart.map((product) => product.product.id)
      : [];
    setSelectedItems(selected);
    caculateTotalPrice(selected);
  };

  const handleSelectOneItems = (
    event: ChangeEvent<HTMLInputElement>,
    productId: string
  ): void => {
    if (!selectedItems.includes(productId)) {
      setSelectedItems((prevSelected) => {
        const selected = [...prevSelected, productId];
        caculateTotalPrice(selected);
        return selected;
      });
    } else {
      setSelectedItems((prevSelected) => {
        const selected = prevSelected.filter((id) => id !== productId);
        caculateTotalPrice(selected);
        return selected;
      });
    }
  };

  return !!cart?.length ? (
    <Box>
      <CardClient>
        <HeaderCart>
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={selectedAllItems}
              indeterminate={selectedSomeItems}
              onChange={handleSelectAllItems}
            />
            <Typography>Tất cả ({cart?.length} sản phẩm)</Typography>
          </Box>
          <DeleteOutlined />
        </HeaderCart>
      </CardClient>
      {cart?.map((c, index) => {
        const isSelected =
          selectedItems && selectedItems.includes(c?.product?.id);

        const minusQuantity = () => {
          setCart((cart: any[]) => {
            cart[index].quantity -= 1;
            const newCart = [...cart];
            caculateTotalPrice(selectedItems);
            localStorage.setItem(
              'cart',
              JSON.stringify(
                newCart.map((item) => {
                  return {
                    productId: item.product.id,
                    quantity: item.quantity
                  };
                })
              )
            );
            return newCart;
          });
        };

        const addQuantity = () => {
          setCart((cart: any[]) => {
            cart[index].quantity += 1;

            const newCart = [...cart];
            caculateTotalPrice(selectedItems);

            localStorage.setItem(
              'cart',
              JSON.stringify(
                newCart.map((item) => {
                  return {
                    productId: item.product.id,
                    quantity: item.quantity
                  };
                })
              )
            );
            return newCart;
          });
        };

        const deleteItemCart = () => {
          setCart((cart: any[]) => {
            const newCart = cart.filter(
              (item) => item?.product?.id !== c?.product?.id
            );
            caculateTotalPrice(selectedItems);
            localStorage.setItem(
              'cart',
              JSON.stringify(
                newCart.map((item) => {
                  return {
                    productId: item.product.id,
                    quantity: item.quantity
                  };
                })
              )
            );
            return newCart;
          });
        };

        const onChange = (e: any) => {
          const value = e.target.value;

          if (value > 1 && value < c.product.quantity) {
            setCart((cart: any[]) => {
              cart[index].quantity = e.target.value;
              const newCart = [...cart];
              caculateTotalPrice(selectedItems);

              localStorage.setItem(
                'cart',
                JSON.stringify(
                  newCart.map((item) => {
                    return {
                      productId: item.product.id,
                      quantity: item.quantity
                    };
                  })
                )
              );
              return newCart;
            });
          }
        };

        return (
          <CardClient key={index}>
            <CartItem>
              <Box display="flex" alignItems="center" mr={1}>
                <Checkbox
                  checked={isSelected}
                  onChange={(event) =>
                    handleSelectOneItems(event, c?.product?.id)
                  }
                  value={isSelected}
                />
                <ImgWrapper src={c?.product?.images[0]} />
              </Box>
              <Box>
                <Typography>{c?.product?.name}</Typography>
                <Box display="flex" alignItems="flex-end">
                  <PriceText discount>
                    {formatter.format(c?.product?.salePrice)}
                  </PriceText>
                  <OriginText>{formatter.format(c?.product?.price)}</OriginText>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  marginTop={2}
                >
                  <Box display="flex" alignItems="center">
                    <ButtonAction
                      variant="outlined"
                      onClick={minusQuantity}
                      disabled={c.quantity <= 1}
                    >
                      <Remove fontSize="small" />
                    </ButtonAction>
                    <NumberItem
                      type="number"
                      value={c.quantity}
                      onChange={onChange}
                    />
                    <ButtonAction
                      variant="outlined"
                      onClick={addQuantity}
                      disabled={c.quantity >= c.product.quantity - 1}
                    >
                      <Add fontSize="small" />
                    </ButtonAction>
                  </Box>
                  <Button onClick={deleteItemCart}>Delete</Button>
                </Box>
              </Box>
            </CartItem>
          </CardClient>
        );
      })}
    </Box>
  ) : (
    <Box>
      <Typography>Không có sản phẩm nào trong giỏ hàng</Typography>
    </Box>
  );
};

export default CartPage;
