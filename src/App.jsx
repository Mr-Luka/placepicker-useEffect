import { useRef, useState, useEffect, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import {sortPlacesByDistance} from './loc.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';

const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedIds.map(id => AVAILABLE_PLACES.find((place)=> place.id === id ));


function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const selectedPlace = useRef();
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);




  useEffect(()=> {
    navigator.geolocation.getCurrentPosition(position => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );

      setAvailablePlaces(sortedPlaces)
    })
  }, []);
 

  function handleStartRemovePlace(id) {
    setModalIsOpen(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if(storedIds.indexOf(id) === -1){
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storedIds]));
    }
  }

  // function that will handle removing places
  const handleRemovePlace = useCallback( function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false)

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem('selectedPlaces', JSON.stringify(storedIds.filter((id)=> id !== selectedPlace.current)))
  }, []);
  

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance"
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;


/*

useCallback() 
returns a value, specifically it returns that function which you wrapped, but now such that it's not recreated
whenever this surrounding component function is executed again, so with useCallback(), react makes sure that this
inner-function is not recreated, instead it stores it internally in memory and reuses that stored function whenever
the component function executes again. So now this is not recreated.
You should use useCallback when passing functions as dependencies to useEffect.
like in: DeleteConfirmation.jsx.
useCallback() also uses dependecy array, same like useEffect()
there you should add any prop or state values that are used inside of this wrapped function. In this case here, 
we have none, I am using a state updating function which does not have to be added, and I am using some browser
features like localStorage or this JSON object which also dont have to be added because they dont trigger this 
component to be rendered again or anything like that, its prop or state values that should be added here.
So here, having an empty array is fine and just as with useEffect(), React will now only recreate this function here
with useCallback() if your dependencies changed. But if you have an empty array of dependecies, there is nothing 
that could change and therefore this function isnt recreated.


useEffect(()=> {
    navigator.geolocation.getCurrentPosition(position => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );

      setAvailablePlaces(sortedPlaces)
    })
  }, []);

  [] - as a second argument to useEffect, so after this anonymous function (where i have rest of the code),
  and that second argument is an array of dependencies of that effect function.
  by setting empty array as an argument, i will not run into infinite loop problem, 
  why is that?
  Idea behind useEffect, is that the first, anonymous function which you pass as a first argument to useEffect will be executed,
  by React after every Component execution.
  So if the app starts and the app component function executes, this code inside useEffect, will not be executed right away.
  Instead its only after the app component function execution finished, so after this JSX code here has been returned.
  That this side effect function you passed to useEffect will be executed by React.
  So React will execute that after after the component function is done executing.
  Now if you then update the state in there like: setAvailablePlaces(sortedPlaces),  the component function executes again 
  as you learned, and in theory this effect function would execute again, but thats where this dependencies array comes into play.
  If you define this dependencies array.
  It will execute the effect function again if the dependecy values changed.
  Since we have empty [], useEffect only executes once, if i am to remove [], the useEffect would execute again after every
  app component render cycle, and therefore we would still have an infinite loop.


  const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if(storedIds.indexOf(id) === -1){
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storedIds]));
    }

This is a side effect that doesnt need the use of useEffect
*/