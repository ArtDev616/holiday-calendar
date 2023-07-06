import React, { useEffect, useState } from 'react';
import './App.css';
import Calendar from './containers/Calendar';
import axios from 'axios';

function App(): JSX.Element {
  const [userCountry, setUserCountry] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=305c67cbae564d7f97519ab3935303b1')
      .then(response => {
        setUserCountry(response.data.country_code2);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user country:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {userCountry && (
        <h1>
          User's Country: {userCountry}
        </h1>
      )}
      <Calendar defaultCountryCode={userCountry} />
    </div>
  );
}

export default App;
