import { ChakraProvider, Container, Heading } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import store from './store'

const App = () => {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Container maxW="container.lg" centerContent>
          <Heading as="h1" size="xl"></Heading>
        </Container>
      </ChakraProvider>
    </Provider>
  )
}

export default App
