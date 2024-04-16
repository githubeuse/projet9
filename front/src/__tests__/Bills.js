/**
 * @jest-environment jsdom
 */
//TEST - BILLS.JS
import '@testing-library/jest-dom';
import { screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { bills } from "../fixtures/bills.js"
import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    //vérifie si l'icone de la page est bien affichée
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

      expect(windowIcon).toBeVisible()
    })
    //vérifie que les factures sont bien affichées dans l'ordre chronologique
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    describe("When I click on the new note de frais button", () => {
      test('Then handleClickNewBill calls onNavigate with correct path', () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        window.onNavigate(ROUTES_PATH.Bills);

        const btnNewBill = screen.getByTestId("btn-new-bill");
        const bill = new Bills({ document, onNavigate, store: null, localStorage });

        const handleClickNewBill = jest.fn(bill.handleClickNewBill);
        btnNewBill.addEventListener("click", handleClickNewBill);

        userEvent.click(btnNewBill);
        expect(handleClickNewBill).toBeCalled();
      });
    })
    describe("When i click on the eye icon", () => {
      test('Then handleClickIconEye is called, updates the modal content and shows the modal', () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const root = document.createElement("div"); 
        root.setAttribute("id", "root");
        document.body.append(root);
        router();

        window.onNavigate(ROUTES_PATH.Bills);

        document.body.innerHTML = BillsUI({ data: bills });
        const bill = new Bills({ document, onNavigate, store: null, localStorage });
        waitFor(() => screen.getAllByTestId("icon-eye"));

        const spy = jest.spyOn(bill, "handleClickIconEye");
        const iconEye = screen.getAllByTestId("icon-eye")[0];
        $.fn.modal = jest.fn();
        userEvent.click(iconEye);

        expect(spy).toBeCalledTimes(1);
        expect($.fn.modal).toBeCalledWith("show");

      });
    });
  });
});


// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {
    beforeEach(() => {
      global.$ = jest.fn(() => ({
        click: jest.fn(),
      }));
    });
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);

      await waitFor(() => screen.getByText("Mes notes de frais"));

      const exempleTypeDeFacture = await screen.getByText("Transports");
      expect(exempleTypeDeFacture).toBeTruthy();

      const exempleStatutDeFacture = await screen.getByText("En attente");
      expect(exempleStatutDeFacture).toBeTruthy();

      expect(screen.queryAllByTestId("icon-eye")).toBeTruthy()
    })
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("fetches bills from an API and fails with 404 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })
      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"))
            }
          }
        })

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
});
