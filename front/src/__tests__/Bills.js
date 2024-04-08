/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
// import Bills from '../containers/Bills'
// import { formatDate, formatStatus } from "../app/format.js"


import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
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
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})



//   test("Then getBills should return a correctly formatted list of bills", async () => {
//     // Créer une liste de factures
//     const billsData = [
//       { id: '1', date: '2021-01-01', amount: '100', type: 'Restaurant', vat: '20' },
//       { id: '2', date: '2021-02-01', amount: '200', type: 'Hotel', vat: '10' },
//     ]

//     // Créer une nouvelle instance de Bills
//     const onNavigate = (pathname) => {
//       document.body.innerHTML = ROUTES_PATH({ pathname })
//     }
//     const localStorage = window.localStorage
//     const bill = new Bills({
//       document, onNavigate, localStorage,
//     })

//     // Remplacer la méthode `getBills` par une version factice
//     bill.getBills = jest.fn().mockResolvedValue(billsData)

//     // Appeler la méthode `getBills` et vérifier qu'elle retourne la liste correctement formatée
//     const result = await bill.getBills()
//     expect(result).toEqual(billsData)
//   })



// })
// })

// // LIGNE 37 VERSION 1
// // describe('Bills', () => {
// //   it('inserts the correct URL into the modal body when an eye icon is clicked', () => {
// //     // Créer un faux DOM avec une icône "œil" et une modale
// //     document.body.innerHTML = `
// //       <div data-testid="icon-eye" data-bill-url="http://example.com"></div>
// //       <div id="modaleFileAdmin1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
// //         <div class="modal-dialog modal-dialog-centered" role="document">
// //           <div class="modal-content">
// //             <div class="modal-body">
// //               <div id="fileAdmin1"></div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     `

// //     // Créer une nouvelle instance de Bills
// //     const onNavigate = (pathname) => {
// //       document.body.innerHTML = ROUTES({ pathname })
// //     }
// //     const firestore = null
// //     const localStorage = window.localStorage
// //     const bill = new Bills({
// //       document, onNavigate, firestore, localStorage, 
// //     })

// //     // Déclencher un événement de clic sur l'icône "œil"
// //     const iconEye = screen.getByTestId('icon-eye')
// //     fireEvent.click(iconEye)

// //     // Vérifier que la bonne URL est insérée dans le corps de la modale
// //     const fileAdmin1 = document.getElementById('fileAdmin1')
// //     expect(fileAdmin1.innerHTML).toContain('http://example.com')
// //   })
// // })



// //LIGNE 37 VERSION 2
// // describe('Bills', () => {
// //   it('inserts the correct URL into the modal body when an eye icon is clicked', () => {
// //     // Créer un faux DOM avec une icône "œil" et une modale
// //     document.body.innerHTML = `
// //       <div data-testid="icon-eye" data-bill-url="http://example.com"></div>
// //       <div id="modaleFileAdmin1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
// //         <div class="modal-dialog modal-dialog-centered" role="document">
// //           <div class="modal-content">
// //             <div class="modal-body">
// //               <div id="fileAdmin1"></div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     `

// //     // Créer une nouvelle instance de Bills
// //     const onNavigate = (pathname) => {
// //       document.body.innerHTML = ROUTES({ pathname })
// //     }
// //     const firestore = null
// //     const localStorage = window.localStorage
// //     const bill = new Bills({
// //       document, onNavigate, firestore, localStorage,
// //     })

// //     // Déclencher un événement de clic sur l'icône "œil"
// //     const iconEye = screen.getByTestId('icon-eye')
// //     fireEvent.click(iconEye)

// //     // Vérifier que la bonne URL est insérée dans le corps de la modale
// //     const fileAdmin1 = document.getElementById('fileAdmin1')
// //     expect(fileAdmin1.innerHTML).toContain('http://example.com')
// //   })
// // })

// describe('Bills', () => {
//   //LIGNE 37 VERSION 3
//   it('inserts the correct URL into the modal body when an eye icon is clicked', async () => {
//     // Créer un faux DOM avec une icône "œil" et une modale
//     document.body.innerHTML = `
//         <div data-testid="icon-eye" data-bill-url="http://example.com"></div>
//         <div id="modaleFileAdmin1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
//           <div class="modal-dialog modal-dialog-centered" role="document">
//             <div class="modal-content">
//               <div class="modal-body">
//                 <div id="fileAdmin1"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       `


//     // Créer une nouvelle instance de Bills
//     const onNavigate = (pathname) => {
//       document.body.innerHTML = ROUTES({ pathname })
//     }
//     const firestore = null
//     const localStorage = window.localStorage
//     const bill = new Bills({
//       document, onNavigate, firestore, localStorage,
//     })

//     // Déclencher un événement de clic sur l'icône "œil"
//     const iconEye = await screen.findByTestId('icon-eye')

//     // Vérifier ce qui est rendu dans le DOM
//     screen.debug()

//     // Vérifier si l'élément est visible
//     expect(iconEye).toBeVisible()

//     fireEvent.click(iconEye)

//     // Vérifier que la bonne URL est insérée dans le corps de la modale
//     const fileAdmin1 = document.getElementById('fileAdmin1')
//     expect(fileAdmin1.innerHTML).toContain('http://example.com')
//   })
// })