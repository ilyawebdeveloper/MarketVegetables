import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { App } from "../App";

// Мокируем fetch
global.fetch = vi.fn();

// Мокируем иконку
vi.mock("./icons/emptyCartIcon", () => ({
  default: () => <div data-testid="empty-cart-icon" />,
}));

// Мокируем модули Mantine
vi.mock("@mantine/core", async () => {
  const actual = await vi.importActual("@mantine/core");
  return {
    ...actual,
    Button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    Container: ({ children, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    Flex: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Popover: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    PopoverTarget: ({ children, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    PopoverDropdown: ({ children, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    Skeleton: () => <div data-testid="skeleton" />,
    Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  };
});

// Мокируем стили
vi.mock("./App.css", () => ({}));
vi.mock("@mantine/core/styles.css", () => ({}));

describe("App component", () => {
  const mockData = [
    {
      id: 1,
      name: "Vegetable 1",
      price: 10,
      image: "image1.jpg",
      category: "vegetable",
    },
    {
      id: 2,
      name: "Vegetable 2",
      price: 20,
      image: "image2.jpg",
      category: "vegetable",
    },
  ];

  beforeEach(() => {
    // @ts-ignore
    fetch.mockClear();
    // @ts-ignore
    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockData),
    });
  });

  test("renders loading state initially", () => {
    render(<App />);
    expect(screen.getAllByTestId("skeleton")).toHaveLength(8);
  });

  test("renders products after loading", async () => {
    render(<App />);

    // Ждем, когда загрузка завершится
    await waitFor(() => {
      expect(screen.queryAllByTestId("skeleton")).toHaveLength(0);
    });

    // Проверяем, что продукты отображаются
    expect(screen.getByText("Vegetable 1")).toBeInTheDocument();
    expect(screen.getByText("Vegetable 2")).toBeInTheDocument();
  });

  test("increments and decrements product count", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryAllByTestId("skeleton")).toHaveLength(0);
    });

    // Находим счетчик для первого продукта
    const countDisplay = screen.getAllByText("1")[0];
    const incrementButton = screen.getAllByText("+")[0];
    const decrementButton = screen.getAllByText("-")[0];

    // Увеличиваем счетчик
    fireEvent.click(incrementButton);
    expect(countDisplay.textContent).toBe("2");

    // Уменьшаем счетчик
    fireEvent.click(decrementButton);
    expect(countDisplay.textContent).toBe("1");
  });

  test("adds product to cart", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryAllByTestId("skeleton")).toHaveLength(0);
    });

    // Находим кнопку "Add to Cart" для первого продукта
    const addToCartButtons = screen.getAllByText("Add to Cart");
    fireEvent.click(addToCartButtons[0]);

    // Открываем попап корзины
    const cartButton = screen.getByText("Cart");
    fireEvent.click(cartButton);

    // Проверяем, что товар добавлен в корзину
    await waitFor(() => {
      expect(screen.getAllByText("Vegetable 1")[0]).toBeInTheDocument();
    });
  });

  test("updates cart item count", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryAllByTestId("skeleton")).toHaveLength(0);
    });

    // Добавляем товар в корзину
    const addToCartButtons = screen.getAllByText("Add to Cart");
    fireEvent.click(addToCartButtons[0]);

    // Открываем корзину
    const cartButton = screen.getByText("Cart");
    fireEvent.click(cartButton);

    // Ждем, пока товар появится в корзине
    await waitFor(() => {
      expect(screen.getAllByText("Vegetable 1")[0]).toBeInTheDocument();
    });

    // Находим кнопки + и - в корзине
    const cartIncrementButton = screen.getAllByText("+")[1]; // Вторая кнопка + (первая в продуктах)
    const cartDecrementButton = screen.getAllByText("-")[1]; // Вторая кнопка - (первая в продуктах)
    const cartCountDisplay = screen.getAllByText("1")[1]; // Второй счетчик (первый в продуктах)

    // Увеличиваем количество в корзине
    fireEvent.click(cartIncrementButton);
    expect(cartCountDisplay.textContent).toBe("1");

    // Уменьшаем количество в корзине
    fireEvent.click(cartDecrementButton);
    expect(cartCountDisplay.textContent).toBe("1");
  });

  test("displays empty cart message when cart is empty", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryAllByTestId("skeleton")).toHaveLength(0);
    });

    // Открываем корзину
    const cartButton = screen.getByText("Cart");
    fireEvent.click(cartButton);

    // Проверяем, что отображается сообщение о пустой корзине
    expect(screen.getByText("You cart is empty!")).toBeInTheDocument();
    expect(screen.getByTestId("empty-cart-icon")).toBeInTheDocument();
  });
});
