/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    let container;
    let mockOnNavigate;
    let mockStore;
    let mockHandleClickNewBill;
    let mockHandleClickIconEye;

    beforeEach(() => {
      // Mise en place de localStorageMock
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));

      // Set up our document body
      document.body.innerHTML = `
        <div id="root">
          <button data-testid="btn-new-bill"></button>
          <div data-testid="icon-eye"></div>
        </div>
      `;
      container = document.body;

      // Mise en place des mocks
      mockOnNavigate = jest.fn();
      mockStore = { bills: jest.fn() };
      mockHandleClickNewBill = jest.fn();
      mockHandleClickIconEye = jest.fn();

      Bills.prototype.handleClickNewBill = mockHandleClickNewBill;
      Bills.prototype.handleClickIconEye = mockHandleClickIconEye;

      jest.mock("../app/format.js", () => ({
        formatDate: jest.fn((date) => {
          if (date === "bad date") {
            throw new Error("Bad date");
          }
          return `mock date: ${date}`;
        }),
        formatStatus: jest.fn((status) => `mock status: ${status}`),
      }));
      const billUI = new Bills({
        document: container,
        onNavigate: mockOnNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });
    });

    test("Then bill icon in vertical layout should be highlighted", async () => {
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");

      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    });

    test("getBills calls store and returns formatted bills", async () => {
      // Set up our mock bills list
      const mockBillsList = [
        { date: "2023-01-01", status: "pending" },
        { date: "2023-02-01", status: "accepted" },
        // Add more mock bills as needed
      ];

      // Set up our mock store to return the mock bills list
      const mockStore = {
        bills: jest.fn().mockReturnValue({
          list: jest.fn().mockResolvedValue(mockBillsList),
        }),
      };

      // Instantiate new Bills class with mock store
      const bills = new Bills({
        document: container,
        onNavigate: mockOnNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });

      // Call getBills and await the result
      const result = await bills.getBills();

      // Check that the store methods were called
      expect(mockStore.bills).toHaveBeenCalled();
      expect(mockStore.bills().list).toHaveBeenCalled();

      // Check that the result is as expected
      expect(result).toEqual([
        { date: "1 Jan. 23", status: "En attente" },
        { date: "1 Fév. 23", status: "Accepté" },
      
      ]);
    });

    test("getBills throws an error for bad dates", async () => {
      const mockList = jest.fn().mockResolvedValue([
        { date: "bad date", status: "status" },
      
      ]);

      mockStore.bills.mockReturnValue({ list: mockList });

      const billUI = new Bills({
        document: container,
        onNavigate: mockOnNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });
      const result = await billUI.getBills();

      expect(result).toEqual([
        { date: "bad date", status: "mock status: status" },
        // Expect transformed bills here
      ]);

      expect(mockList).toHaveBeenCalled();
    });

    test("Then a click event listener should be attached to the new bill button", () => {
      const buttonNewBill = screen.getByTestId("btn-new-bill");
      buttonNewBill.click();
      expect(mockHandleClickNewBill).toHaveBeenCalled();
    });

    test("Then a click event listener should be attached to the eye icon", () => {
      const iconEye = screen.getByTestId("icon-eye");
      iconEye.click();
      expect(mockHandleClickIconEye).toHaveBeenCalled();
    });
  });
});
