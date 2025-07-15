import path from 'path'
import { createDefineMock } from 'vite-plugin-mock-dev-server'

export const defineMock = createDefineMock(mock => {
	mock.url = path.join(import.meta.env.VITE_API_URL, mock.url)
})
