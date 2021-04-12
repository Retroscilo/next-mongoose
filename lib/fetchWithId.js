export default async function IdFetcher (...args) {
  const [ path, id ] = args
  try {
    const response = await fetch(path + id)
    const data = await response.json()

    if (response.ok) return data

    const error = new Error(response)
    error.response = response
    error.data = data
    throw error
  } catch (error) {
    console.log(error.data)
    if (!error.data) error.data = { message: error.message }
    throw error
  }
}
