/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    let container;
    let mockOnNavigate;
    let mockStore;
    let billUI;

    beforeEach(() => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));

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

      // Nouvelle instance de Bills
      billUI = new Bills({
        document: container,
        onNavigate: mockOnNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    test("Then bill icon in vertical layout should be highlighted", async () => {
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");

      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    test("Then getBills should retrieve and format bills from API", async () => {
      const mockBillsList = [
        { date: "2023-01-01", status: "pending" },
        { date: "2023-02-01", status: "accepted" },
      ];
    
      const mockList = jest.fn().mockResolvedValue(mockBillsList);
      mockStore.bills.mockReturnValue({ list: mockList });
    
      const result = await billUI.getBills();
    
      expect(mockStore.bills).toHaveBeenCalled();
      expect(mockStore.bills().list).toHaveBeenCalled();
    
      expect(result).toEqual([
        { date: "1 Jan. 23", status: "En attente" },
        { date: "1 Fév. 23", status: "Accepté" },
      ]);
    });

    test("Then handleClickNewBill should navigate to new bill", () => {
      const buttonNewBill = screen.getByTestId("btn-new-bill");
      userEvent.click(buttonNewBill);
      expect(mockOnNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
    });

    test("Then getBills should throw an error for bad dates", async () => {
      jest.mock("../app/format.js", () => ({
        formatDate: jest.fn((date) => {
          if (date === "bad date") {
            throw new Error("Bad date");
          }
          return `mock date: ${date}`;
        }),
        formatStatus: jest.fn((status) => {
          if (status === "status") {
            throw new Error("Bad status");
          }
          return `mock status: ${status}`;
        }),
      }));
    
      const mockList = jest.fn().mockResolvedValue([{ date: "bad date", status: "status" }]);
      mockStore.bills.mockReturnValue({ list: mockList });
    
      try {
        await billUI.getBills();
      } catch (error) {
        expect(error.message).toBe("Bad date");
      }
    
      expect(mockList).toHaveBeenCalled();
    });

    test("Then a click event listener should be attached to the eye icon", () => {
      const mockModal = jest.fn();
      const mockHtml = jest.fn();
      const mockFind = jest.fn().mockReturnValue({
        html: mockHtml,
      });
    
      global.$ = jest.fn().mockReturnValue({
        modal: mockModal,
        find: mockFind,
        width: jest.fn().mockReturnValue(500),
      });
    
      const iconEye = screen.getByTestId("icon-eye");
      iconEye.setAttribute("data-bill-url", "url");
      
      const spy = jest.spyOn(billUI, 'handleClickIconEye');
    
      billUI.handleClickIconEye(iconEye);
      
      expect(spy).toHaveBeenCalled();
    
      // Vérifier que les méthodes jQuery ont bien été appelées
      expect(global.$).toHaveBeenCalled();
      expect(mockModal).toHaveBeenCalled();
      expect(mockFind).toHaveBeenCalled();
      expect(mockHtml).toHaveBeenCalled();
    });
    
  });
});
