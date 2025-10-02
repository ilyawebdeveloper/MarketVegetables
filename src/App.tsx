import { useEffect } from "react";
import {
  Button,
  Container,
  Flex,
  Popover,
  PopoverTarget,
  PopoverDropdown,
  Skeleton,
  Text,
} from "@mantine/core";
import EmptyCartIcon from "./icons/emptyCartIcon";
import "./App.css";
import "@mantine/core/styles.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import {
  addToCart,
  decrement,
  fetchVigatables,
  increment,
} from "./features/vigatebles/vigatebles";
import type { UnknownAction } from "@reduxjs/toolkit";

export interface Vigatabl {
  image: string;
  category: string;
  id: number;
  name: string;
  price: number;
}

export function App() {
  const {
    vigatablesList,
    vigatablesListCount,
    status,
    cart: cartRedux,
  } = useSelector((state: RootState) => state.vigatebles);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchVigatables() as unknown as UnknownAction);
  }, []);

  const addTooCart = (item: Vigatabl) => {
    const productCart = cartRedux.find((itemCart) => itemCart.id === item.id);
    if (!productCart) {
      dispatch(addToCart(item));
    }
  };

  if (status !== "succeeded") {
    return (
      <Container size="xl" mt={100}>
        <Flex
          gap="sm"
          justify="flex-start"
          align="flex-start"
          direction="row"
          wrap="wrap"
        >
          <Skeleton height={100} mb="md" width={300} h={350} />
          <Skeleton height={100} mb="md" width={300} h={350} />
          <Skeleton height={100} mb="md" width={300} h={350} />
          <Skeleton height={100} mb="md" width={300} h={350} />
          <Skeleton height={100} mb="xl" width={300} h={350} />
          <Skeleton height={100} mb="xl" width={300} h={350} />
          <Skeleton height={100} mb="xl" width={300} h={350} />
          <Skeleton height={100} mb="xl" width={300} h={350} />
        </Flex>
      </Container>
    );
  }

  return (
    <div>
      <Flex
        justify="space-between"
        bg="white"
        p="md"
        mb="xl"
        style={{ position: "fixed", width: "100%", top: "0" }}
      >
        <Flex align="center" justify="center">
          <Text fw={700}>Vegetable</Text>
          <Text fw={700} bg="#54B46A" bdrs="lg" c="white" p={5}>
            SHOP
          </Text>
        </Flex>
        <Flex>
          <Button color="#54B46A" radius="md">
            <Flex bg="white" bdrs="50%" align="center" justify="center" mr={10}>
              <Text fw={600} c="black" px={10}>
                {cartRedux.length}
              </Text>
            </Flex>

            <Popover width={500} position="bottom" withArrow shadow="md">
              <PopoverTarget>
                <Text fw={600} mr={10}>
                  Cart
                </Text>
              </PopoverTarget>
              <PopoverDropdown>
                {cartRedux.length === 0 && (
                  <Flex
                    align="center"
                    justify="center"
                    style={{ flexDirection: "column" }}
                  >
                    <EmptyCartIcon />
                    <Text c="#868E96" fw={400} size="md">
                      You cart is empty!
                    </Text>
                  </Flex>
                )}

                {cartRedux.map((itemCard) => (
                  <div key={itemCard.id}>
                    <Flex justify="space-between">
                      <Flex>
                        <img
                          src={itemCard.image}
                          width="64px"
                          height="64px"
                          alt=""
                        />
                        <Flex
                          style={{ flexDirection: "column" }}
                          align="start"
                          justify="center"
                          ml={10}
                        >
                          <Text size="md">{itemCard.name}</Text>
                          <Text size="md" fw={600}>
                            ${itemCard.price}
                          </Text>
                        </Flex>
                      </Flex>

                      <Flex gap="sm" align="center">
                        <Button
                          variant="filled"
                          color="gray"
                          size="xs"
                          onClick={() => {
                            dispatch(decrement(itemCard.id));
                          }}
                        >
                          <h1>-</h1>
                        </Button>
                        <div>{vigatablesListCount[itemCard.id]}</div>
                        <Button
                          variant="filled"
                          color="gray"
                          size="xs"
                          onClick={() => {
                            dispatch(increment(itemCard.id));
                          }}
                        >
                          <h1>+</h1>
                        </Button>
                      </Flex>
                    </Flex>
                    <div
                      style={{
                        width: "80%",
                        borderBottom: "1px solid #DEE2E6",
                        marginLeft: "20px",
                      }}
                    ></div>
                  </div>
                ))}

                {cartRedux.length > 0 && (
                  <Flex justify="space-between">
                    <Text size="lg" fw={600}>
                      Total
                    </Text>
                    <Text size="lg" fw={600}>
                      {cartRedux?.length &&
                        cartRedux?.reduce(
                          (acc, val) =>
                            acc + val.price * vigatablesListCount[val.id],
                          0
                        )}
                    </Text>
                  </Flex>
                )}
              </PopoverDropdown>
            </Popover>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
            >
              <path
                d="M2.00003 2.16056C1.53979 2.16056 1.1667 2.53366 1.1667 2.9939C1.1667 3.45413 1.53979 3.82723 2.00003 3.82723V2.16056ZM3.91048 2.9939L4.71483 2.77605C4.61645 2.4128 4.28682 2.16056 3.91048 2.16056V2.9939ZM7.01496 14.4566L6.2106 14.6744C6.31916 15.0753 6.70626 15.335 7.11832 15.2835L7.01496 14.4566ZM16.5672 13.2626L16.6706 14.0895C17.0245 14.0452 17.311 13.7807 17.3832 13.4314L16.5672 13.2626ZM18 6.33718L18.8161 6.50602C18.8669 6.26059 18.8045 6.00534 18.6462 5.81099C18.488 5.61665 18.2507 5.50385 18 5.50385V6.33718ZM4.81595 6.33718L4.0116 6.55503L4.81595 6.33718ZM2.00003 3.82723H3.91048V2.16056H2.00003V3.82723ZM7.11832 15.2835L16.6706 14.0895L16.4638 12.4357L6.91159 13.6297L7.11832 15.2835ZM17.3832 13.4314L18.8161 6.50602L17.184 6.16834L15.7511 13.0937L17.3832 13.4314ZM3.10612 3.21174L4.0116 6.55503L5.62031 6.11934L4.71483 2.77605L3.10612 3.21174ZM4.0116 6.55503L6.2106 14.6744L7.81931 14.2387L5.62031 6.11934L4.0116 6.55503ZM18 5.50385H4.81595V7.17052H18V5.50385ZM9.1667 17.5833C9.1667 17.8134 8.98015 18 8.75003 18V19.6666C9.90063 19.6666 10.8334 18.7339 10.8334 17.5833H9.1667ZM8.75003 18C8.51991 18 8.33337 17.8134 8.33337 17.5833H6.6667C6.6667 18.7339 7.59944 19.6666 8.75003 19.6666V18ZM8.33337 17.5833C8.33337 17.3532 8.51991 17.1666 8.75003 17.1666V15.5C7.59944 15.5 6.6667 16.4327 6.6667 17.5833H8.33337ZM8.75003 17.1666C8.98015 17.1666 9.1667 17.3532 9.1667 17.5833H10.8334C10.8334 16.4327 9.90063 15.5 8.75003 15.5V17.1666ZM15.8334 17.5833C15.8334 17.8134 15.6468 18 15.4167 18V19.6666C16.5673 19.6666 17.5 18.7339 17.5 17.5833H15.8334ZM15.4167 18C15.1866 18 15 17.8134 15 17.5833H13.3334C13.3334 18.7339 14.2661 19.6666 15.4167 19.6666V18ZM15 17.5833C15 17.3532 15.1866 17.1666 15.4167 17.1666V15.5C14.2661 15.5 13.3334 16.4327 13.3334 17.5833H15ZM15.4167 17.1666C15.6468 17.1666 15.8334 17.3532 15.8334 17.5833H17.5C17.5 16.4327 16.5673 15.5 15.4167 15.5V17.1666Z"
                fill="white"
              />
            </svg>
          </Button>
        </Flex>
      </Flex>
      <Container size="xl" mt={100}>
        <Text fw={700} size="xl" mb={10}>
          Catalog
        </Text>
        <Flex
          gap="sm"
          justify="flex-start"
          align="flex-start"
          direction="row"
          wrap="wrap"
        >
          {vigatablesList.map((item) => {
            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: "white",
                  width: "285px",
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <img src={item?.image} width="256px" alt="" />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ color: "black" }}>{item?.name}</p>
                  <Flex gap="sm" align="center">
                    <Button
                      variant="filled"
                      color="gray"
                      size="xs"
                      disabled={vigatablesListCount[item.id] <= 1}
                      onClick={() => {
                        dispatch(decrement(item.id));
                      }}
                    >
                      <h1>-</h1>
                    </Button>
                    <div>{vigatablesListCount[item.id]}</div>
                    <Button
                      variant="filled"
                      color="gray"
                      size="xs"
                      onClick={() => {
                        dispatch(increment(item.id));
                      }}
                    >
                      <h1>+</h1>
                    </Button>
                  </Flex>
                </div>
                <Flex justify="space-between" align="center">
                  <Text fw={700}>${item?.price}</Text>

                  <Button
                    variant="filled"
                    color="#E7FAEB"
                    size="md"
                    radius="md"
                    disabled={cartRedux.find((itemCart) => itemCart.id === item.id) !== undefined}
                    onClick={() => {
                      addTooCart(item);
                    }}
                  >
                    <Text c="#3B944E">Add to Cart</Text>

                    <div style={{ marginLeft: "10px" }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                      >
                        <path
                          d="M2.5 1.66056C2.03976 1.66056 1.66667 2.03366 1.66667 2.4939C1.66667 2.95413 2.03976 3.32723 2.5 3.32723V1.66056ZM4.41045 2.4939L5.2148 2.27605C5.11642 1.9128 4.78679 1.66056 4.41045 1.66056V2.4939ZM7.51493 13.9566L6.71057 14.1744C6.81913 14.5753 7.20623 14.835 7.61829 14.7835L7.51493 13.9566ZM17.0672 12.7626L17.1705 13.5895C17.5244 13.5452 17.811 13.2807 17.8832 12.9314L17.0672 12.7626ZM18.5 5.83718L19.3161 6.00602C19.3668 5.76059 19.3045 5.50534 19.1462 5.31099C18.9879 5.11665 18.7506 5.00385 18.5 5.00385V5.83718ZM5.31592 5.83718L4.51156 6.05503L5.31592 5.83718ZM2.5 3.32723H4.41045V1.66056H2.5V3.32723ZM7.61829 14.7835L17.1705 13.5895L16.9638 11.9357L7.41156 13.1297L7.61829 14.7835ZM17.8832 12.9314L19.3161 6.00602L17.684 5.66834L16.2511 12.5937L17.8832 12.9314ZM3.60609 2.71174L4.51156 6.05503L6.12028 5.61934L5.2148 2.27605L3.60609 2.71174ZM4.51156 6.05503L6.71057 14.1744L8.31928 13.7387L6.12028 5.61934L4.51156 6.05503ZM18.5 5.00385H5.31592V6.67052H18.5V5.00385ZM9.66667 17.0833C9.66667 17.3134 9.48012 17.5 9.25 17.5V19.1666C10.4006 19.1666 11.3333 18.2339 11.3333 17.0833H9.66667ZM9.25 17.5C9.01988 17.5 8.83333 17.3134 8.83333 17.0833H7.16667C7.16667 18.2339 8.09941 19.1666 9.25 19.1666V17.5ZM8.83333 17.0833C8.83333 16.8532 9.01988 16.6666 9.25 16.6666V15C8.09941 15 7.16667 15.9327 7.16667 17.0833H8.83333ZM9.25 16.6666C9.48012 16.6666 9.66667 16.8532 9.66667 17.0833H11.3333C11.3333 15.9327 10.4006 15 9.25 15V16.6666ZM16.3333 17.0833C16.3333 17.3134 16.1468 17.5 15.9167 17.5V19.1666C17.0673 19.1666 18 18.2339 18 17.0833H16.3333ZM15.9167 17.5C15.6866 17.5 15.5 17.3134 15.5 17.0833H13.8333C13.8333 18.2339 14.7661 19.1666 15.9167 19.1666V17.5ZM15.5 17.0833C15.5 16.8532 15.6866 16.6666 15.9167 16.6666V15C14.7661 15 13.8333 15.9327 13.8333 17.0833H15.5ZM15.9167 16.6666C16.1468 16.6666 16.3333 16.8532 16.3333 17.0833H18C18 15.9327 17.0673 15 15.9167 15V16.6666Z"
                          fill="#3B944E"
                        />
                      </svg>
                    </div>
                  </Button>
                </Flex>
              </div>
            );
          })}
        </Flex>
      </Container>
    </div>
  );
}
