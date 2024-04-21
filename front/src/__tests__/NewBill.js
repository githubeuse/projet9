/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

import store from "../__mocks__/store.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
      test("Then mail icon in vertical layout should be highlighted", async () => {
        const html = NewBillUI()
        document.body.innerHTML = html
      //to-do write assertion
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
  
        window.onNavigate(ROUTES_PATH.NewBill);
  
        // récupération de l'icône
        await waitFor(() => screen.getByTestId("icon-mail"));
        const mailIcon = screen.getByTestId("icon-mail");
  
        //vérification si l'icône contient la classe active-icon
        const iconActivated = mailIcon.classList.contains("active-icon");
        expect(iconActivated).toBeTruthy();
      });
      describe("When I click on the choisir un fichier button and upload a right type file", () => {
        test("Then handleChangeFile displays the right file's name", () => {
          //page NewBill
          const html = NewBillUI();
          document.body.innerHTML = html;
          const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname });
          };
          // initialisation NewBill
          const newBill = new NewBill({
            document,
            onNavigate,
            store,
            localStorage: window.localStorage,
          });
          const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
          const input = screen.getByTestId("file");
          input.addEventListener("change", handleChangeFile);
          //fichier au bon format
          fireEvent.change(input, {
            target: {
              files: [
                new File(["image.png"], "image.png", {
                  type: "image/png",
                }),
              ],
            },
          });
          expect(handleChangeFile).toHaveBeenCalled();
          expect(input.files[0].name).toBe("image.png");
        });
      });
  
    })
  })