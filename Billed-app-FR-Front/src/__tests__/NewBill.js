/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

    // test("Then 'envoyer une note de frais' text should be present on the page", () => {
    //   const html = NewBillUI()
    //   document.body.innerHTML = html
    //   const text = screen.getByText(/envoyer une note de frais/i)
    //   expect(text).toBeTruthy()
    // })
    


    test('handleChangeFile returns alert for incorrect file format', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
    
      const newBill = new NewBill({ document })
      const event = { preventDefault: jest.fn(), target: { value: 'fakePath\\fakeFile.txt' } }
      window.alert = jest.fn()
    
      newBill.handleChangeFile(event)
    
      expect(window.alert).toHaveBeenCalledWith('Seules les images au format jpg, jpeg ou png sont autorisées.')
    })

    test('handleSubmit calls updateBill and onNavigate', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
    
      const onNavigate = jest.fn()
      const newBill = new NewBill({ document, onNavigate })
      const event = { preventDefault: jest.fn() }
    
      // Mocking necessary inputs
      localStorage.setItem('user', JSON.stringify({ email: 'employee@billed.com' }))
      newBill.fileUrl = 'http://test.com'
      newBill.fileName = 'test.png'
    
      newBill.updateBill = jest.fn()
      
      newBill.handleSubmit(event)
    
      expect(newBill.updateBill).toHaveBeenCalled()
      expect(onNavigate).toHaveBeenCalled()
    })

    test('updateBill calls store.bills().update', () => {
      const store = {
        bills: jest.fn().mockReturnValue({
          update: jest.fn().mockResolvedValue({}),
        }),
      }
      
      const newBill = new NewBill({ document, store })
      const bill = {}
    
      newBill.updateBill(bill)
    
      expect(store.bills().update).toHaveBeenCalled()
    })

    test('handleChangeFile calls store.bills().create for correct file format', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
    
      const store = {
        bills: jest.fn().mockReturnValue({
          create: jest.fn().mockResolvedValue({}),
        }),
      }
    
      const newBill = new NewBill({ document, store })
      const event = { preventDefault: jest.fn(), target: { value: 'fakePath\\fakeFile.jpg' } }
      window.alert = jest.fn()
    
      // Mocking necessary inputs
      localStorage.setItem('user', JSON.stringify({ email: 'employee@billed.com' }))
    
      newBill.handleChangeFile(event)
    
      expect(store.bills().create).toHaveBeenCalled()
    })
    
    test('handleChangeFile logs an error for failed store.bills().create', async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
    
      const store = {
        bills: jest.fn().mockReturnValue({
          create: jest.fn().mockRejectedValue(new Error('Store Error')),
        }),
      }
    
      const newBill = new NewBill({ document, store })
      const event = { preventDefault: jest.fn(), target: { value: 'fakePath\\fakeFile.jpg' } }
      
      console.error = jest.fn()
    
      newBill.handleChangeFile(event)
    
      expect(console.error).toHaveBeenCalledWith(new Error('Store Error'))
    })
 
  })
})
