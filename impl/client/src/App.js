import { useState } from 'react'
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import GetUpdatedApplicationList from './components/GetUpdatedApplicationList/GetUpdatedApplicationList'

function App() {

  const [loader, setLoader] = useState(false);


  return (
    <>
      <Header />
        <GetUpdatedApplicationList />
      <Footer />
    </>
  );
}

export default App;
